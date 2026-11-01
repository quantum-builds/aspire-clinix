import { stripe } from "@/utils/stripe";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getSubscriptionPeriod } from "@/lib/stripe-period";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const body = await req.json();
    const { newPlanId } = body;

    if (!newPlanId) {
      return NextResponse.json(
        createResponse(false, "New plan ID is required", null),
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

    const currentMembership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id, status: "ACTIVE" },
    });

    if (!currentMembership) {
      return NextResponse.json(
        createResponse(false, "No active membership found", null),
        { status: 400 },
      );
    }

    // Note: newPlanId is matched against the plan's name, as before.
    const newPlan = await prisma.membershipPlan.findFirst({
      where: { name: newPlanId },
    });

    if (!newPlan) {
      return NextResponse.json(
        createResponse(false, "New plan not found", null),
        { status: 404 },
      );
    }

    if (!newPlan.isActive) {
      return NextResponse.json(
        createResponse(false, "New plan is not active", null),
        { status: 400 },
      );
    }

    if (currentMembership.planId === newPlan.id) {
      return NextResponse.json(
        createResponse(false, "Patient is already on this plan", null),
        { status: 400 },
      );
    }

    if (currentMembership.pendingPlanId === newPlan.id) {
      return NextResponse.json(
        createResponse(false, "This plan change is already scheduled", null),
        { status: 400 },
      );
    }

    if (currentMembership.cancelAtPeriodEnd) {
      return NextResponse.json(
        createResponse(
          false,
          "Membership is set to cancel. Reactivate it before changing plans.",
          null,
        ),
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

    if (!["active", "trialing"].includes(subscription.status)) {
      return NextResponse.json(
        createResponse(false, "Subscription is not in good standing", null),
        { status: 400 },
      );
    }

    // Only monthly prices keep the "starts next month" behaviour.
    // A different interval would reset the billing cycle and invoice immediately.
    const newPrice = await stripe.prices.retrieve(newPlan.stripePriceId);

    if (
      !newPrice.active ||
      newPrice.recurring?.interval !== "month" ||
      newPrice.recurring?.interval_count !== 1
    ) {
      throw new Error(
        `Plan ${newPlan.id} has a non-monthly or inactive Stripe price`,
      );
    }

    // One monthly plan = one subscription item. Use it directly rather than
    // looking it up by the DB price, which breaks when a change is already pending.
    const item = subscription.items.data[0];

    if (!item) {
      throw new Error(`Subscription ${subscription.id} has no items`);
    }

    // Swap the price with no proration: nothing is charged now,
    // and the new price is billed at the next renewal.
    await stripe.subscriptionItems.update(item.id, {
      price: newPlan.stripePriceId,
      proration_behavior: "none",
    });

    // Period end lives on the item in newer Stripe API versions,
    // and on the subscription in older ones.
    const period = getSubscriptionPeriod(subscription);

    const effectiveDate =
      period?.currentPeriodEnd ?? currentMembership.currentPeriodEnd;

    // planId stays the same until the renewal invoice is paid;
    // the invoice.paid webhook moves pendingPlanId into planId.
    await prisma.patientMembership.update({
      where: { id: currentMembership.id },
      data: { pendingPlanId: newPlan.id },
    });

    return NextResponse.json(
      createResponse(true, "Plan change scheduled", {
        pendingPlanId: newPlan.id,
        effectiveDate,
      }),
    );
  } catch (error) {
    console.error("Membership plan change error:", error);

    return NextResponse.json(
      createResponse(
        false,
        "Could not change the plan. Please try again.",
        null,
      ),
      { status: 500 },
    );
  }
}
