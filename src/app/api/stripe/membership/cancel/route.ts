import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
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

    const currentMembership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id, status: "ACTIVE" },
    });

    if (!currentMembership) {
      return NextResponse.json(
        createResponse(false, "No active membership found", null),
        { status: 400 },
      );
    }

    // Cancel the Stripe subscription at period end
    await stripe.subscriptions.update(currentMembership.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update PatientMembership
    await prisma.patientMembership.update({
      where: { id: currentMembership.id },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
        pendingPlanId: null,
      },
    });

    return NextResponse.json(
      createResponse(true, "Membership cancellation scheduled", null),
    );
  } catch (error) {
    console.error("Cancel membership error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Cancel membership failed",
        null,
      ),
      { status: 500 },
    );
  }
}
