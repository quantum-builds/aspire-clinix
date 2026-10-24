import type Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createResponse } from "@/utils/createResponse";
import {
  claimEvent,
  markProcessed,
  releaseEvent,
} from "@/lib/stripe/webhooks/events";
import {
  HandlerResult,
  ok,
  RetryableWebhookError,
} from "@/lib/stripe/webhooks/result";
import {
  onTreatmentSessionPaid,
  onWellnessAppointmentPaid,
} from "@/lib/stripe/webhooks/booking";
import {
  onInvoicePaid,
  onInvoicePaymentFailed,
  onMembershipCheckoutCompleted,
  onSubscriptionDeleted,
  onSubscriptionUpdated,
} from "@/lib/stripe/webhooks/membership";

/**
 * The only Stripe webhook endpoint for aspire-clinix.
 *
 * Registered in Stripe as `<app url>/api/webhooks/stripe` with the events:
 *   checkout.session.completed
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   invoice.paid
 *   invoice.payment_failed
 *
 * The Stripe account is shared with other apps, which receive the same
 * events. Checkouts are routed by `metadata.payment_for`; anything that is
 * not ours is acknowledged with a 200 and ignored.
 *
 * See STRIPE_SETUP_PLAN.md for the full design.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<HandlerResult> {
  const paymentFor = session.metadata?.payment_for;

  switch (paymentFor) {
    case "wellness_appointment":
      return onWellnessAppointmentPaid(session);
    case "treatment_session":
      return onTreatmentSessionPaid(session);
    case "membership":
      return onMembershipCheckoutCompleted(session);
    default:
      return ok(`Checkout not handled by this app (payment_for=${paymentFor ?? "none"}), ignored`);
  }
}

async function dispatch(event: Stripe.Event): Promise<HandlerResult> {
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutCompleted(event.data.object);
    case "customer.subscription.updated":
      return onSubscriptionUpdated(event.data.object);
    case "customer.subscription.deleted":
      return onSubscriptionDeleted(event.data.object);
    case "invoice.paid":
      return onInvoicePaid(event.data.object);
    case "invoice.payment_failed":
      return onInvoicePaymentFailed(event.data.object);
    default:
      return ok(`Event type ${event.type} not handled, ignored`);
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_SECRET_WEBHOOK_KEY?.trim();

  if (!secret) {
    console.error("STRIPE_SECRET_WEBHOOK_KEY is not set");
    return NextResponse.json(
      createResponse(false, "Webhook secret not configured", null),
      { status: 500 },
    );
  }

  if (!signature) {
    return NextResponse.json(
      createResponse(false, "Missing stripe-signature header", null),
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json(createResponse(false, "Invalid signature", null), {
      status: 400,
    });
  }

  const claim = await claimEvent(event.id, event.type);

  if (claim !== "claimed") {
    console.log(`Stripe event ${event.id} (${event.type}) skipped: ${claim}`);

    // In progress elsewhere: answer 409 so Stripe retries later and the
    // other run's outcome decides.
    return NextResponse.json(
      createResponse(true, `Event ${claim}`, null),
      { status: claim === "duplicate" ? 200 : 409 },
    );
  }

  let result: HandlerResult;

  try {
    result = await dispatch(event);
  } catch (error) {
    await releaseEvent(event.id).catch((releaseError) =>
      console.error("Failed to release Stripe event claim:", releaseError),
    );

    console.error(
      `Stripe event ${event.id} (${event.type}) failed, Stripe will retry:`,
      error,
      error instanceof RetryableWebhookError ? error.details : undefined,
    );

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Webhook processing failed",
        null,
      ),
      { status: 500 },
    );
  }

  // The work is done at this point. If recording that fails, keep the claim
  // rather than releasing it, so a retry cannot repeat a booking or refund.
  await markProcessed(event.id).catch((markError) =>
    console.error("Failed to mark Stripe event processed:", event.id, markError),
  );

  console.log(`Stripe event ${event.id} (${event.type}): ${result.message}`);

  return NextResponse.json(
    createResponse(result.outcome === "ok", result.message, result.data ?? null),
    { status: result.outcome === "ok" ? 200 : 400 },
  );
}
