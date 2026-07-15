import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { DentistReferralPageTYpe } from "@/types/common";
import { calcChange } from "@/utils/calculatePercatageChnage";
import { createResponse } from "@/utils/createResponse";
import { Prisma, ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getPractitioners } from "@/dentallyHelpers/practitioners";

function isJwtToken(token: string | JWT | null): token is JWT {
  return typeof token === "object" && token !== null && !Array.isArray(token);
}

async function resolveReferralDentistId(
  token: Awaited<ReturnType<typeof getToken>>,
): Promise<{ localDentistId: string | null; role: string | null }> {
  if (!isJwtToken(token) || !token.sub) {
    return { localDentistId: null, role: null };
  }

  if (token.role === TokenRoles.REFERRING_DENTIST) {
    return { localDentistId: String(token.sub), role: token.role as string };
  }

  if (token.role === TokenRoles.DENTALLY_PRACTITIONER) {
    const dentallyId = Number(token.sub);

    if (Number.isNaN(dentallyId)) {
      return { localDentistId: null, role: token.role as string };
    }

    const dentist = await prisma.dentist.findFirst({
      where: { dentallyId },
      select: { id: true },
    });

    return { localDentistId: dentist?.id ?? null, role: token.role as string };
  }

  return { localDentistId: null, role: token.role as string };
}
/**
 * @swagger
 * /api/referral-requests:
 *   get:
 *     summary: Get referral requests
 *     tags: [Referral Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient or referral name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ASSIGNED, UNASSIGNED]
 *         description: Filter by request status
 *       - in: query
 *         name: page-type
 *         schema:
 *           type: string
 *         description: Filter by referral page type
 *       - in: query
 *         name: stats-only
 *         schema:
 *           type: boolean
 *         description: Return only referral stats
 *     responses:
 *       200:
 *         description: Referral requests fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral requests fetched successfully."
 *               data:
 *                 referralRequests:
 *                   - id: "ref_01HXYZ1234ABCDE"
 *                     referralFormId: "form_01HXYZ1234ABCDE"
 *                     requestStatus: "UNASSIGNED"
 *                     createdAt: "2026-04-29T10:00:00.000Z"
 *                     referralForm:
 *                       patientName: "John Doe"
 *                       referralName: "Dr Smith"
 *                 pagination:
 *                   page: 1
 *                   total: 12
 *                   totalPages: 2
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No referral request found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No referral request found"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role === TokenRoles.PATIENT) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";
    const statusParam = searchParams.get("status") || "";
    const pageType = searchParams.get("page-type") || "";
    const statsOnlyParam = searchParams.get("stats-only");
    const statsOnly = statsOnlyParam === "true";
    const { localDentistId: referralDentistId, role: dentistRole } = await resolveReferralDentistId(token);

    if (statsOnly) {
      const now = new Date();

      const thisWeekStart = new Date();
      thisWeekStart.setDate(now.getDate() - 7);

      const lastWeekStart = new Date();
      lastWeekStart.setDate(now.getDate() - 14);
      const lastWeekEnd = thisWeekStart;

      let baseWhere: Prisma.ReferralRequestWhereInput = {
        createdAt: { gte: thisWeekStart, lte: now },
      };

      if (token.role === TokenRoles.DENTALLY_PRACTITIONER) {
        if (pageType === DentistReferralPageTYpe.REQUEST && referralDentistId) {
          baseWhere.assignedDentistId = referralDentistId;
        } else if (pageType === DentistReferralPageTYpe.HISTORY && referralDentistId) {
          (baseWhere.referralForm ??= {}).referralDentistId = referralDentistId;
        }
      } else if (token.role === TokenRoles.REFERRING_DENTIST && referralDentistId) {
        (baseWhere.referralForm ??= {}).referralDentistId = referralDentistId;
      }

      const statuses = Object.values(ReferralRequestStatus);
      const [thisWeekTotal, ...thisWeekStatusCounts] = await Promise.all([
        prisma.referralRequest.count({ where: baseWhere }),
        ...statuses.map((s) =>
          prisma.referralRequest.count({ where: { ...baseWhere, requestStatus: s } }),
        ),
      ]);

      const [lastWeekTotal, ...lastWeekStatusCounts] = await Promise.all([
        prisma.referralRequest.count({
          where: { ...baseWhere, createdAt: { gte: lastWeekStart, lte: lastWeekEnd } },
        }),
        ...statuses.map((s) =>
          prisma.referralRequest.count({
            where: {
              ...baseWhere,
              requestStatus: s,
              createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
            },
          }),
        ),
      ]);

      const thisWeekAssigned =
        thisWeekStatusCounts[statuses.indexOf(ReferralRequestStatus.ASSIGNED)];
      const thisWeekUnassigned =
        thisWeekStatusCounts[statuses.indexOf(ReferralRequestStatus.UNASSIGNED)];

      const lastWeekAssigned =
        lastWeekStatusCounts[statuses.indexOf(ReferralRequestStatus.ASSIGNED)];
      const lastWeekUnassigned =
        lastWeekStatusCounts[statuses.indexOf(ReferralRequestStatus.UNASSIGNED)];

      const averageReferrals =
        thisWeekTotal === 0
          ? 0
          : Math.round((thisWeekAssigned / thisWeekTotal) * 100);

      return NextResponse.json(
        createResponse(true, "Referral stats fetched successfully.", {
          totalReferrals: {
            count: thisWeekTotal,
            percentageChange: calcChange(thisWeekTotal, lastWeekTotal),
          },
          assignedReferrals: {
            count: thisWeekAssigned,
            percentageChange: calcChange(thisWeekAssigned, lastWeekAssigned),
          },
          unassignedReferrals: {
            count: thisWeekUnassigned,
            percentageChange: calcChange(
              thisWeekUnassigned,
              lastWeekUnassigned,
            ),
          },
          averageReferrals: {
            count: averageReferrals,
            percentageChange: calcChange(thisWeekAssigned, lastWeekAssigned),
          },
        }),
        { status: 200 },
      );
    }

    let dentallyPractitionerEmails = new Set<string>();

    try {
      const practitionersResponse = await getPractitioners();
      if (!practitionersResponse.isError) {
        dentallyPractitionerEmails = new Set<string>(
          (practitionersResponse.response.practitioners || []).map(
            (practitioner: any) =>
              practitioner.user?.email?.trim().toLowerCase(),
          ),
        );
      } else {
        console.log(
          "[referral-requests] Dentally practitioners lookup failed",
          {
            isError: practitionersResponse.isError,
          },
        );
      }
    } catch (error) {
      console.error("Failed to fetch Dentally practitioners:", error);
    }

    const limit = 10;
    const skip = (page - 1) * limit;

    const status =
      statusParam &&
      Object.values(ReferralRequestStatus).includes(
        statusParam as ReferralRequestStatus,
      )
        ? (statusParam as ReferralRequestStatus)
        : undefined;
    let assignedDentistFilter: string | null = null;
    let referringDentistFilter: string | null = null;

    if (token.role === TokenRoles.DENTALLY_PRACTITIONER) {
      if (pageType === DentistReferralPageTYpe.REQUEST) {
        assignedDentistFilter = referralDentistId;
      } else if (pageType === DentistReferralPageTYpe.HISTORY) {
        referringDentistFilter = referralDentistId;
      }
    } else if (token.role === TokenRoles.REFERRING_DENTIST) {
      referringDentistFilter = referralDentistId;
    }

    let dateFilter: Prisma.ReferralFormWhereInput = {};

    if (before) {
      dateFilter.createdAt = {
        ...((dateFilter.createdAt as Prisma.DateTimeFilter<"ReferralForm">) ??
          {}),
        lte: new Date(before),
      };
    }

    if (after) {
      dateFilter.createdAt = {
        ...((dateFilter.createdAt as Prisma.DateTimeFilter<"ReferralForm">) ??
          {}),
        gte: new Date(after),
      };
    }

    if (on) {
      const date = new Date(on);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      dateFilter.createdAt = {
        gte: date,
        lt: nextDay,
      };
    }

    const andConditions: Prisma.ReferralRequestWhereInput[] = [];

    if (search) {
      andConditions.push({
        OR: [
          {
            referralForm: {
              patientName: { contains: search, mode: "insensitive" },
            },
          },
          {
            referralForm: {
              referralName: { contains: search, mode: "insensitive" },
            },
          },
        ],
      });
    }

    if (assignedDentistFilter) {
      andConditions.push({ assignedDentistId: assignedDentistFilter });
    }

    if (referringDentistFilter) {
      andConditions.push({ referralForm: { referralDentistId: referringDentistFilter } });
    }

    if (status) {
      andConditions.push({ requestStatus: status });
    }

    if (Object.keys(dateFilter).length) {
      andConditions.push({ referralForm: dateFilter });
    }

    let baseWhere: Prisma.ReferralRequestWhereInput =
      andConditions.length ? { AND: andConditions } : {};

    const [referralRequests, totalCount] = await Promise.all([
      prisma.referralRequest.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          referralForm: {
            include: {
              referralDentist: true,
            },
          },
        },
      }),
      prisma.referralRequest.count({ where: baseWhere }),
    ]);

    console.log("Referral requests BE:", referralRequests);
    console.log("Total count: BE", totalCount);
    if (referralRequests.length === 0) {
      return NextResponse.json(
        createResponse(false, "No referral request found", null),
        { status: 404 },
      );
    }

    const referralRequestsWithFlags = referralRequests.map(
      (referralRequest) => {
        const dentistEmail =
          referralRequest.referralForm.referralEmail?.trim().toLowerCase() ||
          referralRequest.referralForm.referralDentist?.email
            ?.trim()
            .toLowerCase() ||
          "";

        return {
          ...referralRequest,
          isReferringDentistFromDentally: dentistEmail
            ? dentallyPractitionerEmails.has(dentistEmail)
            : false,
        };
      },
    );

    console.log("Referral requests with flags BE", referralRequestsWithFlags);

    return NextResponse.json(
      createResponse(true, "Referral requests fetched successfully.", {
        referralRequests: referralRequestsWithFlags,
        pagination: {
          page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
