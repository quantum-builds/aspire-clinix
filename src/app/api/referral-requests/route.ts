import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { DentistReferralPageTYpe } from "@/types/common";
import { calcChange } from "@/utils/calculatePercatageChnage";
import { createResponse } from "@/utils/createResponse";
import { Prisma, ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (
      token.role === TokenRoles.PATIENT ||
      token.role === TokenRoles.RECIEVING_DENTIST
    ) {
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

    if (statsOnly) {
      const now = new Date();

      const thisWeekStart = new Date();
      thisWeekStart.setDate(now.getDate() - 7);

      const lastWeekStart = new Date();
      lastWeekStart.setDate(now.getDate() - 14);
      const lastWeekEnd = thisWeekStart;

      // build where filter depending on role and pageType
      let baseWhere: Prisma.ReferralRequestWhereInput = {
        createdAt: { gte: thisWeekStart, lte: now },
      };

      // if dentist or receiving dentist, and page-type=request
      if (
        (token.role === TokenRoles.DENTIST ||
          token.role === TokenRoles.REFERRING_DENTIST) &&
        (searchParams.get("page-type") === DentistReferralPageTYpe.HISTORY)
      ) {
        (baseWhere.referralForm ??= {}).referralDentistId = token.sub;
      }

      const [thisWeekTotal, thisWeekAssigned, thisWeekUnassigned] = await Promise.all([
        prisma.referralRequest.count({ where: baseWhere }),
        prisma.referralRequest.count({
          where: {
            ...baseWhere,
            requestStatus: ReferralRequestStatus.ASSIGNED,
          },
        }),
        prisma.referralRequest.count({
          where: {
            ...baseWhere,
            requestStatus: ReferralRequestStatus.UNASSIGNED,
          },
        }),
      ]);

      const [lastWeekTotal, lastWeekAssigned, lastWeekUnassigned] = await Promise.all([
        prisma.referralRequest.count({
          where: {
            ...baseWhere,
            createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
          },
        }),
        prisma.referralRequest.count({
          where: {
            ...baseWhere,
            requestStatus: ReferralRequestStatus.ASSIGNED,
            createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
          },
        }),
        prisma.referralRequest.count({
          where: {
            ...baseWhere,
            requestStatus: ReferralRequestStatus.UNASSIGNED,
            createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
          },
        }),
      ]);

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
            percentageChange: calcChange(thisWeekUnassigned, lastWeekUnassigned),
          },
          averageReferrals: {
            count: averageReferrals,
            percentageChange: calcChange(thisWeekAssigned, lastWeekAssigned),
          },
        }),
        { status: 200 }
      );
    }

    const limit = 10;
    const skip = (page - 1) * limit;

    const status =
      statusParam &&
        Object.values(ReferralRequestStatus).includes(
          statusParam as ReferralRequestStatus
        )
        ? (statusParam as ReferralRequestStatus)
        : undefined;
    let referringDentist = null;
    if (
      (pageType === DentistReferralPageTYpe.HISTORY && token.role === TokenRoles.DENTIST) ||
      token.role === TokenRoles.REFERRING_DENTIST
    ) {
      referringDentist = token.sub;
    }

    let recievingDentist = null;
    if (
      (pageType === DentistReferralPageTYpe.REQUEST && token.role === TokenRoles.DENTIST) ||
      token.role === TokenRoles.RECIEVING_DENTIST
    ) {
      recievingDentist = token.sub;
    }

    let dateFilter: Prisma.ReferralFormWhereInput = {};

    if (before) {
      dateFilter.createdAt = {
        ...(dateFilter.createdAt as Prisma.DateTimeFilter<'ReferralForm'> ?? {}),
        lte: new Date(before),
      };
    }

    if (after) {
      dateFilter.createdAt = {
        ...(dateFilter.createdAt as Prisma.DateTimeFilter<'ReferralForm'> ?? {}),
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

    let baseWhere: Prisma.ReferralRequestWhereInput = {
      AND: [
        {
          ...(search && {
            OR: [
              { referralForm: { patientName: { contains: search, mode: "insensitive" } } },
              { referralForm: { referralName: { contains: search, mode: "insensitive" } } },
              { assignedDentist: { fullName: { contains: search, mode: "insensitive" } } },
            ],
          }),
        },
        ...(referringDentist ? [{ referralForm: { referralDentistId: referringDentist } }] : []),
        ...(recievingDentist ? [{ assignedDentistId: recievingDentist }] : []),
        ...(status ? [{ requestStatus: status }] : []),
        ...(Object.keys(dateFilter).length ? [{ referralForm: dateFilter }] : []),
      ],
    };


    const [referralRequests, totalCount] = await Promise.all([
      prisma.referralRequest.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { referralForm: true, assignedDentist: true },
      }),
      prisma.referralRequest.count({ where: baseWhere }),
    ]);

    if (referralRequests.length === 0) {
      return NextResponse.json(
        createResponse(false, "No referral request found", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Referral requests fetched successfully.", {
        referralRequests,
        pagination: {
          page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching referral request ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
