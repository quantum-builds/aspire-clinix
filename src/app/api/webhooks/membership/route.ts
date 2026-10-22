import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  getInvoiceSubscriptionId,
  getSubscriptionPeriod,
  mapStripeStatus,
} from "@/lib/stripe-period";
import type Stripe from "stripe";

/**
 * Bring the stored membership in line with Stripe.
 *
 * Shared by `customer.subscription.updated` and `invoice.paid` so both paths
 * apply exactly the same rules:
 * - the billing period is synced from Stripe (item level since Basil),
 * - usage counters reset only when the period actually rolled over,
 * - a scheduled plan change is promoted to the active plan only once the new
 *   period has started, i.e. at renewal and not when the price is swapped.
 */
async function syncMembershipFromStripe(subscription: Stripe.Subscription) {
  const period = getSubscriptionPeriod(subscription);

  if (!period) {
    console.error(
      "Stripe subscription payload has no billing period:",
      subscription.id,
    );

    return { synced: false, reason: "period_missing" } as const;
  }

  const membership = await prisma.patientMembership.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!membership) {
    console.error(
      "PatientMembership not found for subscription:",
      subscription.id,
    );

    return { synced: false, reason: "not_found" } as const;
  }

  const periodRolledOver =
    period.currentPeriodStart.getTime() !== membership.currentPeriodStart.getTime();

  // The pending plan only takes effect once the new billing period starts.
  const promotePendingPlan = Boolean(membership.pendingPlanId) && periodRolledOver;
  const status = mapStripeStatus(subscription.status);

  await prisma.patientMembership.update({
    where: { id: membership.id },
    data: {
      ...(promotePendingPlan
        ? { planId: membership.pendingPlanId!, pendingPlanId: null }
        : {}),
      currentPeriodStart: period.currentPeriodStart,
      currentPeriodEnd: period.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      ...(status ? { status } : {}),
      ...(periodRolledOver
        ? {
            usedTreatments: 0,
            usedHyperbaric: 0,
            usedBreathwork: 0,
            usedGuestPasses: 0,
          }
        : {}),
    },
  });

  if (promotePendingPlan) {
    console.log(
      "Scheduled plan change activated for membership:",
      membership.id,
      "new plan:",
      membership.pendingPlanId,
    );
  }

  return { synced: true } as const;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      createResponse(false, "Missing stripe-signature header", null),
      { status: 400 },
    );
  }

  let event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(createResponse(false, "Invalid signature", null), {
      status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata;

      console.log("Stripe membership checkout completed:", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata,
      });

      if (metadata?.payment_for === "membership") {
        const { planId, patientId } = metadata;

        if (!planId || !patientId) {
          console.error("Missing membership metadata:", metadata);

          return NextResponse.json(
            createResponse(
              false,
              "Missing required membership metadata",
              null,
            ),
            { status: 400 },
          );
        }

        if (session.payment_status !== "paid") {
          console.warn(
            "Checkout completed but payment is not marked as paid:",
            session.payment_status,
          );

          return NextResponse.json(
            createResponse(
              true,
              "Webhook received but payment is not yet paid",
              null,
            ),
          );
        }

        const dentallyId = Number(patientId);

        const patient = await prisma.patient.findUnique({
          where: { dentallyId },
        });

        if (!patient) {
          console.error("Patient not found for dentallyId:", dentallyId);

          return NextResponse.json(
            createResponse(false, "Patient not found", null),
            { status: 404 },
          );
        }

        const plan = await prisma.membershipPlan.findUnique({
          where: { id: planId },
        });

        if (!plan) {
          console.error("Membership plan not found:", planId);

          return NextResponse.json(
            createResponse(false, "Membership plan not found", null),
            { status: 404 },
          );
        }

        const stripeSubscriptionId = session.subscription as string;
        const stripeCustomerId = session.customer as string;

        let currentPeriodStart = new Date();
        let currentPeriodEnd = new Date();

        if (stripeSubscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              stripeSubscriptionId,
            );
            const period = getSubscriptionPeriod(subscription);

            if (period) {
              currentPeriodStart = period.currentPeriodStart;
              currentPeriodEnd = period.currentPeriodEnd;
            } else {
              console.error(
                "Stripe subscription has no billing period:",
                stripeSubscriptionId,
              );
            }
          } catch (subError) {
            console.error(
              "Failed to retrieve Stripe subscription:",
              subError,
            );
          }
        }

        await prisma.patientMembership.create({
          data: {
            patientId: patient.id,
            planId: plan.id,
            stripeCustomerId,
            stripeSubscriptionId,
            status: "ACTIVE",
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: false,
            usedTreatments: 0,
            usedHyperbaric: 0,
            usedBreathwork: 0,
            usedGuestPasses: 0,
          },
        });

        console.log(
          "PatientMembership created successfully for patient:",
          patient.id,
          "plan:",
          plan.name,
        );
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;

      console.log("Stripe subscription updated:", {
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });

      const result = await syncMembershipFromStripe(subscription);

      if (!result.synced) {
        if (result.reason === "period_missing") {
          return NextResponse.json(
            createResponse(false, "Subscription has no billing period", null),
            { status: 400 },
          );
        }

        return NextResponse.json(
          createResponse(false, "Membership not found", null),
          { status: 404 },
        );
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const stripeSubscriptionId = getInvoiceSubscriptionId(invoice);

      if (!stripeSubscriptionId) {
        console.log(
          "Stripe invoice.paid without a subscription, ignoring:",
          invoice.id,
        );
      } else {
        // The renewal invoice is the authoritative signal that the new
        // billing period started, so the scheduled plan change is applied
        // here. The subscription is fetched through the SDK, which returns
        // the fields in the version the SDK is pinned to.
        try {
          const subscription = await stripe.subscriptions.retrieve(
            stripeSubscriptionId,
          );

          await syncMembershipFromStripe(subscription);
        } catch (error) {
          console.error(
            "Failed to sync membership from invoice.paid:",
            stripeSubscriptionId,
            error,
          );
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const membership = await prisma.patientMembership.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (membership) {
        await prisma.patientMembership.update({
          where: { id: membership.id },
          data: {
            status: "CANCELLED",
            cancelAtPeriodEnd: true,
            cancelledAt: new Date(),
            pendingPlanId: null,
          },
        });

        console.log("Membership cancelled:", membership.id);
      }
    }

    return NextResponse.json(createResponse(true, "Webhook received", null));
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Webhook processing failed",
        null,
      ),
      { status: 500 },
    );
  }
}
