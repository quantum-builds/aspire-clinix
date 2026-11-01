import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  evaluatePlanEligibility,
  syncMembershipPeriod,
} from "@/lib/plan-booking";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const body = await req.json();
    const { treatmentId } = body;

    if (!treatmentId) {
      return NextResponse.json(
        createResponse(false, "Missing treatmentId", null),
        { status: 400 },
      );
    }

    const dentallyId = Number(token.id);

    if (Number.isNaN(dentallyId)) {
      return NextResponse.json(
        createResponse(false, "Invalid patient session", null),
        { status: 401 },
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { dentallyId },
    });

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "Patient not found", null),
        { status: 404 },
      );
    }

    const membership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id, status: "ACTIVE" },
      include: { plan: true },
    });

    if (!membership) {
      return NextResponse.json(
        createResponse(true, "No active plan", { status: "NO_ACTIVE_PLAN" }),
        { status: 200 },
      );
    }

    const synced = await syncMembershipPeriod(prisma, membership);
    const outcome = evaluatePlanEligibility(
      synced,
      synced.plan,
      Number(treatmentId),
    );

    return NextResponse.json(
      createResponse(true, "Eligibility check complete", {
        status: outcome,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Eligibility check error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Eligibility check failed",
        null,
      ),
      { status: 500 },
    );
  }
}