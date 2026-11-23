import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma, ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/analytics/referrals/top-referrers:
 *   get:
 *     summary: Get top referring dentists by number of referrals
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
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 10
 *         description: Number of referrers to return (max 10)
 *     responses:
 *       200:
 *         description: Top referrers fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Top referrers fetched successfully."
 *               data:
 *                 referrers:
 *                   - gdc: "123456"
 *                     name: "Dr Smith"
 *                     practice: "Smile Dental"
 *                     total: 9
 *                     accepted: 7
 *                     converted: 5
 *                     conversionRate: 55.56
 *                     lastReferralAt: "2026-11-20T10:00:00.000Z"
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
    // At most 10 dentists are returned at a time.
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "10", 10) || 10,
      10,
    );

    const endDate = before ? new Date(before) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = after ? new Date(after) : new Date(endDate);
    if (!after) startDate.setDate(endDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

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
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
        referralGDC: true,
        referralName: true,
        practiceName: true,
        referralRequest: {
          select: {
            requestStatus: true,
            appointmentId: true,
          },
        },
      },
    });

    // Ordered newest first, so the first referral seen for a GDC gives the
    // latest name, practice and referral date.
    const referrersByGdc: Record<
      string,
      {
        gdc: string;
        name: string;
        practice: string | null;
        total: number;
        accepted: number;
        converted: number;
        conversionRate: number;
        lastReferralAt: Date;
      }
    > = {};

    for (const referral of referrals) {
      const gdc = referral.referralGDC.trim();

      if (!referrersByGdc[gdc]) {
        referrersByGdc[gdc] = {
          gdc,
          name: referral.referralName.trim(),
          practice: referral.practiceName?.trim() || null,
          total: 0,
          accepted: 0,
          converted: 0,
          conversionRate: 0,
          lastReferralAt: referral.createdAt,
        };
      }

      referrersByGdc[gdc].total += 1;

      if (
        referral.referralRequest?.requestStatus ===
          ReferralRequestStatus.ASSIGNED ||
        referral.referralRequest?.requestStatus ===
          ReferralRequestStatus.ACCEPTED
      ) {
        referrersByGdc[gdc].accepted += 1;
      }

      if (referral.referralRequest?.appointmentId) {
        referrersByGdc[gdc].converted += 1;
      }
    }

    const referrers = Object.values(referrersByGdc)
      .map((referrer) => ({
        ...referrer,
        conversionRate: Number(
          ((referrer.converted / referrer.total) * 100).toFixed(2),
        ),
      }))
      .sort((a, b) => b.total - a.total || b.converted - a.converted)
      .slice(0, limit);

    return NextResponse.json(
      createResponse(true, "Top referrers fetched successfully.", {
        referrers,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Top referrers API error:", error);

    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
