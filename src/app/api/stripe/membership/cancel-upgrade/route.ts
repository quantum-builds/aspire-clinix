import { stripe } from "@/utils/stripe";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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
      include: { plan: true },
    });

    if (!currentMembership) {
      return NextResponse.json(
        createResponse(false, "No active membership found", null),
        { status: 400 },
      );
    }

    if (!currentMembership.pendingPlanId) {
      return NextResponse.json(
        createResponse(false, "No pending plan change found", null),
        { status: 400 },
      );
    }

    const subscription = await stripe.subscriptions.retrieve(
      currentMembership.stripeSubscriptionId,
    );

    if (subscription.cancel_at_period_end) {
      return NextResponse.json(
        createResponse(
          false,
          "Membership is set to cancel. Reactivate it before changing plans.",
          null,
        ),
        { status: 400 },
      );
    }

    const item = subscription.items.data[0];

    if (!item) {
      throw new Error(`Subscription ${subscription.id} has no items`);
    }

    if (item.price.id !== currentMembership.plan.stripePriceId) {
      await stripe.subscriptionItems.update(item.id, {
        price: currentMembership.plan.stripePriceId,
        proration_behavior: "none",
      });
    }

    await prisma.patientMembership.update({
      where: { id: currentMembership.id },
      data: { pendingPlanId: null },
    });

    return NextResponse.json(
      createResponse(true, "Pending plan change cancelled", null),
    );
  } catch (error) {
    console.error("Cancel plan change error:", error);

    return NextResponse.json(
      createResponse(
        false,
        "Could not cancel the plan change. Please try again.",
        null,
      ),
      { status: 500 },
    );
  }
}
