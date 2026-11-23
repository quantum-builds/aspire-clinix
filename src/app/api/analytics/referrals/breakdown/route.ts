import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { toTitleCase } from "@/utils/formatWords";
import {
  CallStatus,
  DentistResponseStatus,
  Prisma,
  ReferralRequestStatus,
} from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/analytics/referrals/breakdown:
 *   get:
 *     summary: Get referral status, funnel, specialty and call status breakdown
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
 *     responses:
 *       200:
 *         description: Referral breakdown fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral breakdown fetched successfully."
 *               data:
 *                 status:
 *                   - status: "UNASSIGNED"
 *                     count: 8
 *                 funnel:
 *                   - stage: "Received"
 *                     count: 50
 *                   - stage: "Assigned"
 *                     count: 40
 *                   - stage: "Accepted"
 *                     count: 32
 *                   - stage: "Patient confirmed"
 *                     count: 25
 *                   - stage: "Appointment booked"
 *                     count: 21
 *                 specialty:
 *                   - specialty: "Orthodontics"
 *                     count: 18
 *                 callStatus:
 *                   - status: "PENDING"
 *                     count: 7
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
      select: {
        cbct: true,
        dentalSpecialty: true,
        callStatus: true,
        referralRequest: {
          select: {
            requestStatus: true,
            dentistResponseStatus: true,
            assignedDentistId: true,
            appointmentId: true,
          },
        },
      },
    });

    const statusCounts: Record<string, number> = {};
    Object.values(ReferralRequestStatus).forEach((status) => {
      statusCounts[status] = 0;
    });

    const callStatusCounts: Record<string, number> = {};
    Object.values(CallStatus).forEach((status) => {
      callStatusCounts[status] = 0;
    });
    callStatusCounts["NOT_SET"] = 0;

    const specialtyCounts: Record<string, number> = {};

    let assigned = 0;
    let accepted = 0;
    let patientConfirmed = 0;
    let appointmentBooked = 0;

    for (const referral of referrals) {
      const callStatus = referral.callStatus ?? "NOT_SET";
      callStatusCounts[callStatus] += 1;

      const specialtyLabel = referral.cbct
        ? "CBCT"
        : referral.dentalSpecialty
          ? toTitleCase(referral.dentalSpecialty)
          : "Other";
      specialtyCounts[specialtyLabel] =
        (specialtyCounts[specialtyLabel] ?? 0) + 1;

      if (referral.callStatus === CallStatus.CONFIRM) {
        patientConfirmed += 1;
      }

      const request = referral.referralRequest;

      if (!request) continue;

      statusCounts[request.requestStatus] += 1;

      if (request.assignedDentistId) assigned += 1;

      if (request.dentistResponseStatus === DentistResponseStatus.ACCEPTED) {
        accepted += 1;
      }

      if (request.appointmentId) appointmentBooked += 1;
    }

    return NextResponse.json(
      createResponse(true, "Referral breakdown fetched successfully.", {
        status: Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        })),

        funnel: [
          { stage: "Received", count: referrals.length },
          { stage: "Assigned", count: assigned },
          { stage: "Accepted", count: accepted },
          { stage: "Patient confirmed", count: patientConfirmed },
          { stage: "Appointment booked", count: appointmentBooked },
        ],

        specialty: Object.entries(specialtyCounts)
          .map(([specialty, count]) => ({ specialty, count }))
          .sort((a, b) => b.count - a.count)
          // Only the top 4 specialties are shown.
          .slice(0, 4),

        callStatus: Object.entries(callStatusCounts).map(
          ([status, count]) => ({
            status,
            count,
          }),
        ),
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Referral breakdown API error:", error);

    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
