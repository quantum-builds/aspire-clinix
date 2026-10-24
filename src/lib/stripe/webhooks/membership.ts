import type Stripe from "stripe";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe/client";
import {
  getInvoiceSubscriptionId,
  getSubscriptionPeriod,
  mapStripeStatus,
} from "@/lib/stripe-period";
import { HandlerResult, ok, rejected } from "./result";

/**
 * Membership webhooks.
 *
 * Business rules (see STRIPE_SETUP_PLAN.md, section 2):
 * - cancel takes effect at period end; reactivate within the period keeps
 *   the current usage,
 * - plan changes swap the price with no proration and take effect at
 *   renewal, when `invoice.paid` promotes `pendingPlanId` to `planId`,
 * - a failed renewal keeps access while Stripe retries; access ends on
 *   `customer.subscription.deleted`,
 * - a new purchase after a membership ended reuses the patient's row and
 *   resets the usage counters.
 *
 * The Stripe account is shared with other apps, so subscription and invoice
 * events for subscriptions we do not know are ignored with a 200.
 */

const ZERO_USAGE = {
  usedTreatments: 0,
  usedHyperbaric: 0,
  usedBreathwork: 0,
  usedGuestPasses: 0,
} as const;

const LIVE_SUBSCRIPTION_STATUSES: Stripe.Subscription.Status[] = [
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "incomplete",
];

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/**
 * Bring the stored membership in line with Stripe.
 *
 * Shared by `customer.subscription.updated`, `invoice.paid` and the initial
 * checkout so every path applies exactly the same rules:
 * - the billing period is synced from Stripe,
 * - usage counters reset only when the period actually rolled over,
 * - a scheduled plan change is promoted only once the new period started.
 */
export async function syncMembershipFromStripe(
  subscription: Stripe.Subscription,
): Promise<HandlerResult> {
  const membership = await prisma.patientMembership.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!membership) {
    // Normal for subscriptions that belong to the other apps on this account.
    console.log("No membership for subscription, ignoring:", subscription.id);
    return ok("Not an aspire-clinix membership, ignored");
  }

  const period = getSubscriptionPeriod(subscription);

  if (!period) {
    console.error("Subscription has no billing period:", subscription.id);
    return rejected("Subscription has no billing period");
  }

  const periodRolledOver =
    period.currentPeriodStart.getTime() !==
    membership.currentPeriodStart.getTime();

  const promotePendingPlan =
    Boolean(membership.pendingPlanId) && periodRolledOver;
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
      ...(periodRolledOver ? ZERO_USAGE : {}),
    },
  });

  if (promotePendingPlan) {
    console.log(
      "Scheduled plan change activated:",
      membership.id,
      "new plan:",
      membership.pendingPlanId,
    );
  }

  return ok("Membership synced");
}

/**
 * The patient already holds a different live subscription, so this purchase
 * is a duplicate (two tabs, double click). Cancel the new subscription and
 * refund its first payment so the patient is not billed twice.
 */
async function undoDuplicateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["latest_invoice"],
  });

  if (subscription.status !== "canceled") {
    await stripe.subscriptions.cancel(subscriptionId);
  }

  const invoice = subscription.latest_invoice as Stripe.Invoice | null;
  const paymentIntent = idOf(
    (invoice as unknown as { payment_intent?: string | { id: string } })
      ?.payment_intent,
  );

  if (paymentIntent) {
    await stripe.refunds.create(
      { payment_intent: paymentIntent },
      { idempotencyKey: `refund-duplicate-subscription-${subscriptionId}` },
    );
  }
}

/** `checkout.session.completed` with `payment_for=membership`. */
export async function onMembershipCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<HandlerResult> {
  const metadata = session.metadata ?? {};
  const { planId, patientId } = metadata;

  if (session.mode !== "subscription") {
    return rejected("Membership checkout is not a subscription");
  }

  if (!planId || !patientId) {
    console.error("Missing membership metadata:", metadata);
    return rejected("Missing required membership metadata");
  }

  if (session.payment_status !== "paid") {
    console.warn(
      "Membership checkout completed but not paid:",
      session.id,
      session.payment_status,
    );
    return ok("Webhook received but payment is not yet paid");
  }

  const stripeSubscriptionId = idOf(session.subscription);
  const stripeCustomerId = idOf(session.customer);

  if (!stripeSubscriptionId || !stripeCustomerId) {
    console.error("Membership checkout without subscription/customer:", session.id);
    return rejected("Checkout session has no subscription or customer");
  }

  const patient = await prisma.patient.findUnique({
    where: { dentallyId: Number(patientId) },
  });

  if (!patient) {
    console.error("Patient not found for membership:", patientId);
    return rejected("Patient not found");
  }

  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });

  if (!plan) {
    console.error("Membership plan not found:", planId);
    return rejected("Membership plan not found");
  }

  const existing = await prisma.patientMembership.findUnique({
    where: { patientId: patient.id },
  });

  if (
    existing &&
    existing.stripeSubscriptionId !== stripeSubscriptionId &&
    existing.status === "ACTIVE"
  ) {
    const current = await stripe.subscriptions
      .retrieve(existing.stripeSubscriptionId)
      .catch(() => null);

    if (current && LIVE_SUBSCRIPTION_STATUSES.includes(current.status)) {
      console.error(
        "Patient already has a live membership; cancelling and refunding the new one:",
        { patientId: patient.id, kept: current.id, cancelled: stripeSubscriptionId },
      );
      await undoDuplicateSubscription(stripeSubscriptionId);
      return ok("Duplicate membership purchase cancelled and refunded");
    }
  }

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const period = getSubscriptionPeriod(subscription);

  if (!period) {
    console.error("Subscription has no billing period:", stripeSubscriptionId);
  }

  const currentPeriodStart = period?.currentPeriodStart ?? new Date();
  const currentPeriodEnd =
    period?.currentPeriodEnd ??
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const fields = {
    planId: plan.id,
    stripeCustomerId,
    stripeSubscriptionId,
    status: "ACTIVE" as const,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelledAt: null,
    pendingPlanId: null,
    ...ZERO_USAGE,
  };

  // Same subscription delivered again (should not happen past the event
  // claim, but never reset usage for a subscription we already track).
  if (existing?.stripeSubscriptionId === stripeSubscriptionId) {
    return syncMembershipFromStripe(subscription);
  }

  // One row per patient: a returning member reuses it with fresh usage.
  await prisma.patientMembership.upsert({
    where: { patientId: patient.id },
    create: { patientId: patient.id, ...fields },
    update: fields,
  });

  if (!patient.stripeCustomerId) {
    await prisma.patient.updateMany({
      where: { id: patient.id, stripeCustomerId: null },
      data: { stripeCustomerId },
    });
  }

  console.log(
    existing ? "Membership restarted:" : "Membership created:",
    patient.id,
    plan.name,
    stripeSubscriptionId,
  );

  return ok(existing ? "Membership restarted" : "Membership created");
}

/** `customer.subscription.updated` */
export async function onSubscriptionUpdated(
  subscription: Stripe.Subscription,
): Promise<HandlerResult> {
  return syncMembershipFromStripe(subscription);
}

/** `invoice.paid`: the authoritative signal that a new period started. */
export async function onInvoicePaid(
  invoice: Stripe.Invoice,
): Promise<HandlerResult> {
  const subscriptionId = getInvoiceSubscriptionId(invoice);

  if (!subscriptionId) {
    return ok("Invoice without a subscription, ignored");
  }

  const known = await prisma.patientMembership.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    select: { id: true },
  });

  if (!known) {
    return ok("Not an aspire-clinix membership, ignored");
  }

  // Fetched through the SDK so the fields are in the SDK's pinned version.
  // A Stripe error throws and the event is retried.
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return syncMembershipFromStripe(subscription);
}

/**
 * `invoice.payment_failed`: log only. Access stays while Stripe retries the
 * card, and ends on `customer.subscription.deleted` if every retry fails.
 */
export async function onInvoicePaymentFailed(
  invoice: Stripe.Invoice,
): Promise<HandlerResult> {
  const subscriptionId = getInvoiceSubscriptionId(invoice);

  if (!subscriptionId) {
    return ok("Invoice without a subscription, ignored");
  }

  const membership = await prisma.patientMembership.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    select: { id: true, patientId: true },
  });

  if (!membership) {
    return ok("Not an aspire-clinix membership, ignored");
  }

  console.warn("Membership renewal payment failed:", {
    membershipId: membership.id,
    patientId: membership.patientId,
    subscriptionId,
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count,
    nextPaymentAttempt: invoice.next_payment_attempt
      ? new Date(invoice.next_payment_attempt * 1000).toISOString()
      : null,
  });

  return ok("Payment failure logged");
}

/** `customer.subscription.deleted`: the membership has ended. */
export async function onSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<HandlerResult> {
  const membership = await prisma.patientMembership.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!membership) {
    return ok("Not an aspire-clinix membership, ignored");
  }

  await prisma.patientMembership.update({
    where: { id: membership.id },
    data: {
      status: "CANCELLED",
      cancelAtPeriodEnd: true,
      cancelledAt: new Date(),
      pendingPlanId: null,
    },
  });

  console.log("Membership ended:", membership.id);

  return ok("Membership cancelled");
}
