import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/analytics/referrals/trend:
 *   get:
 *     summary: Get referrals received vs converted to appointment over time
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (default 30 days ago)
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (default today)
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter by dental specialty, or "CBCT"
 *       - in: query
 *         name: practice
 *         schema:
 *           type: string
 *         description: Filter by referring practice name
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Group by day, week or month (default picked from the date range)
 *     responses:
 *       200:
 *         description: Referral trend fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral trend fetched successfully."
 *               data:
 *                 interval: "week"
 *                 points:
 *                   - date: "2026-11-02"
 *                     received: 12
 *                     converted: 5
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

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const { searchParams } = new URL(req.url);

    const after = searchParams.get("after") || "";
    const before = searchParams.get("before") || "";
    const specialty = searchParams.get("specialty") || "";
    const practice = searchParams.get("practice") || "";
    const intervalParam = searchParams.get("interval") || "";

    const endDate = before ? new Date(before) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = after ? new Date(after) : new Date(endDate);
    if (!after) startDate.setDate(endDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    let interval = "month";
    if (["day", "week", "month"].includes(intervalParam)) {
      interval = intervalParam;
    } else if (totalDays <= 31) {
      interval = "day";
    } else if (totalDays <= 180) {
      interval = "week";
    }

    const where: Prisma.ReferralFormWhereInput = {
      createdAt: { gte: startDate, lte: endDate },
      ...(specialty &&
        (specialty.toLowerCase() === "cbct"
          ? { cbct: { not: null } }
          : { dentalSpecialty: { equals: specialty, mode: "insensitive" } })),
      ...(practice && {
        practiceName: { contains: practice, mode: "insensitive" },
      }),
    };

    const referrals = await prisma.referralForm.findMany({
      where,
      select: {
        createdAt: true,
        referralRequest: { select: { appointmentId: true } },
      },
    });

    // Start of the day, the Monday of the week, or the 1st of the month.
    const getBucketStart = (date: Date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      if (interval === "week") {
        const day = start.getDay();
        start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));
      }

      if (interval === "month") {
        start.setDate(1);
      }

      return start;
    };

    const getBucketKey = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Fill every bucket in the range with 0 so the chart has no gaps.
    const points: Record<
      string,
      { date: string; received: number; converted: number }
    > = {};

    const cursor = getBucketStart(startDate);

    while (cursor <= endDate) {
      const key = getBucketKey(cursor);
      points[key] = { date: key, received: 0, converted: 0 };

      if (interval === "day") cursor.setDate(cursor.getDate() + 1);
      if (interval === "week") cursor.setDate(cursor.getDate() + 7);
      if (interval === "month") cursor.setMonth(cursor.getMonth() + 1);
    }

    for (const referral of referrals) {
      const key = getBucketKey(getBucketStart(new Date(referral.createdAt)));

      if (!points[key]) continue;

      points[key].received += 1;

      if (referral.referralRequest?.appointmentId) {
        points[key].converted += 1;
      }
    }

    return NextResponse.json(
      createResponse(true, "Referral trend fetched successfully.", {
        interval,
        points: Object.values(points),
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Referral trend API error:", error);

    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
