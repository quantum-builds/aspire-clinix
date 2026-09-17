import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { DentistReferralPageTYpe } from "@/types/common";
import { calcChange } from "@/utils/calculatePercatageChnage";
import { createResponse } from "@/utils/createResponse";
import { Prisma, ReferralRequestStatus, CallStatus } from "@prisma/client";
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
    const callStatusParam = searchParams.get("call-status") || "";
    const pageType = searchParams.get("page-type") || "";
    const statsOnly = searchParams.get("stats-only") === "true";

    const { localDentistId: referralDentistId } =
      await resolveReferralDentistId(token);

    /*
     * ================================
     * Referral Statistics
     * ================================
     */
    if (statsOnly) {
      const now = new Date();

      const day = now.getDay();

      const diffToMonday = day === 0 ? -6 : 1 - day;

      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() + diffToMonday);
      thisWeekStart.setHours(0, 0, 0, 0);

      const thisWeekEnd = new Date(thisWeekStart);
      thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
      thisWeekEnd.setHours(23, 59, 59, 999);

      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);

      const lastWeekEnd = new Date(thisWeekEnd);
      lastWeekEnd.setDate(thisWeekEnd.getDate() - 7);

      let dentistFilter: Prisma.ReferralRequestWhereInput = {};

      if (
        token.role === TokenRoles.DENTALLY_PRACTITIONER &&
        referralDentistId
      ) {
        if (pageType === DentistReferralPageTYpe.REQUEST) {
          dentistFilter.assignedDentistId = referralDentistId;
        }

        if (pageType === DentistReferralPageTYpe.HISTORY) {
          dentistFilter.referralForm = {
            referralDentistId,
          };
        }
      } else if (
        token.role === TokenRoles.REFERRING_DENTIST &&
        referralDentistId
      ) {
        dentistFilter.referralForm = {
          referralDentistId,
        };
      }

      const [
        totalReferrals,
        assignedReferrals,
        unassignedReferrals,
        thisWeekTotal,
        thisWeekAssigned,
        thisWeekUnassigned,
        lastWeekTotal,
        lastWeekAssigned,
        lastWeekUnassigned,
      ] = await Promise.all([
        prisma.referralRequest.count({
          where: dentistFilter,
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            requestStatus: ReferralRequestStatus.ASSIGNED,
          },
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            requestStatus: ReferralRequestStatus.UNASSIGNED,
          },
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            createdAt: {
              gte: thisWeekStart,
              lte: thisWeekEnd,
            },
          },
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            requestStatus: ReferralRequestStatus.ASSIGNED,
            createdAt: {
              gte: thisWeekStart,
              lte: thisWeekEnd,
            },
          },
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            requestStatus: ReferralRequestStatus.UNASSIGNED,
            createdAt: {
              gte: thisWeekStart,
              lte: thisWeekEnd,
            },
          },
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            createdAt: {
              gte: lastWeekStart,
              lte: lastWeekEnd,
            },
          },
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            requestStatus: ReferralRequestStatus.ASSIGNED,
            createdAt: {
              gte: lastWeekStart,
              lte: lastWeekEnd,
            },
          },
        }),

        prisma.referralRequest.count({
          where: {
            ...dentistFilter,
            requestStatus: ReferralRequestStatus.UNASSIGNED,
            createdAt: {
              gte: lastWeekStart,
              lte: lastWeekEnd,
            },
          },
        }),
      ]);

      const firstReferral = await prisma.referralRequest.findFirst({
        where: dentistFilter,
        orderBy: {
          createdAt: "asc",
        },
        select: {
          createdAt: true,
        },
      });

      let averageReferrals = 0;

      if (firstReferral) {
        const totalDays = Math.max(
          1,
          Math.ceil(
            (now.getTime() - new Date(firstReferral.createdAt).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        );

        const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));

        averageReferrals = Math.round(totalReferrals / totalWeeks);
      }

      console.log({
        thisWeekStart,
        thisWeekEnd,
        lastWeekStart,
        lastWeekEnd,
        thisWeekTotal,
        lastWeekTotal,
      });

      return NextResponse.json(
        createResponse(true, "Referral stats fetched successfully.", {
          totalReferrals: {
            count: totalReferrals,
            percentageChange: calcChange(thisWeekTotal, lastWeekTotal),
          },

          assignedReferrals: {
            count: assignedReferrals,
            percentageChange: calcChange(thisWeekAssigned, lastWeekAssigned),
          },

          unassignedReferrals: {
            count: unassignedReferrals,
            percentageChange: calcChange(
              thisWeekUnassigned,
              lastWeekUnassigned,
            ),
          },

          averageReferrals: {
            count: averageReferrals,
            percentageChange: calcChange(thisWeekTotal, lastWeekTotal),
          },
        }),
        {
          status: 200,
        },
      );
    }

    const limit = 10;
    const skip = (page - 1) * limit;

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

    const andConditions: Prisma.ReferralRequestWhereInput[] = [];

    if (search) {
      andConditions.push({
        OR: [
          {
            referralForm: {
              patientName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            referralForm: {
              referralName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      });
    }

    if (assignedDentistFilter) {
      andConditions.push({
        assignedDentistId: assignedDentistFilter,
      });
    }

    if (referringDentistFilter) {
      andConditions.push({
        referralForm: {
          referralDentistId: referringDentistFilter,
        },
      });
    }

    if (statusParam) {
      andConditions.push({
        requestStatus: statusParam as ReferralRequestStatus,
      });
    }

    if (callStatusParam) {
      andConditions.push({
        referralForm: {
          callStatus: callStatusParam as CallStatus,
        },
      });
    }

    const where = andConditions.length ? { AND: andConditions } : {};

    const [referralRequests, totalCount] = await Promise.all([
      prisma.referralRequest.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          referralForm: {
            include: {
              referralDentist: true,
            },
          },
        },
      }),

      prisma.referralRequest.count({
        where,
      }),
    ]);

    return NextResponse.json(
      createResponse(true, "Referral requests fetched successfully.", {
        referralRequests,
        pagination: {
          page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Referral request API error:", error);

    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
