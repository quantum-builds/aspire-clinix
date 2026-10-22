import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSubscriptionPeriod } from "@/lib/stripe-period";

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

    if (currentMembership.cancelAtPeriodEnd) {
      return NextResponse.json(
        createResponse(false, "Membership is already set to cancel", null),
        { status: 400 },
      );
    }

    const subscription = await stripe.subscriptions.retrieve(
      currentMembership.stripeSubscriptionId,
    );

    if (subscription.status === "canceled") {
      return NextResponse.json(
        createResponse(false, "Subscription is already cancelled", null),
        { status: 400 },
      );
    }

    const item = subscription.items.data[0];

    if (item && item.price.id !== currentMembership.plan.stripePriceId) {
      await stripe.subscriptionItems.update(item.id, {
        price: currentMembership.plan.stripePriceId,
        proration_behavior: "none",
      });
    }

    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    // The membership stays usable until the current period ends, so that is
    // the date the cancellation takes effect on.
    const period = getSubscriptionPeriod(updated);
    const endsAt =
      period?.currentPeriodEnd ??
      (updated.cancel_at ? new Date(updated.cancel_at * 1000) : null);

    await prisma.patientMembership.update({
      where: { id: currentMembership.id },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: endsAt,
        pendingPlanId: null,
      },
    });

    return NextResponse.json(
      createResponse(true, "Membership cancellation scheduled", { endsAt }),
    );
  } catch (error) {
    console.error("Cancel membership error:", error);

    return NextResponse.json(
      createResponse(
        false,
        "Could not cancel the membership. Please try again.",
        null,
      ),
      { status: 500 },
    );
  }
}
