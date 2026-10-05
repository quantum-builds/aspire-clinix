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

    if (!currentMembership.cancelAtPeriodEnd) {
      return NextResponse.json(
        createResponse(false, "Membership is not scheduled for cancellation", null),
        { status: 400 },
      );
    }

    // Reactivate the Stripe subscription
    await stripe.subscriptions.update(currentMembership.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update PatientMembership
    await prisma.patientMembership.update({
      where: { id: currentMembership.id },
      data: {
        cancelAtPeriodEnd: false,
        cancelledAt: null,
      },
    });

    return NextResponse.json(
      createResponse(true, "Membership reactivated successfully", null),
    );
  } catch (error) {
    console.error("Reactivate membership error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Reactivate failed",
        null,
      ),
      { status: 500 },
    );
  }
}
