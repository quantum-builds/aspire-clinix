import type Stripe from "stripe";
import { MembershipStatus } from "@prisma/client";

/**
 * Helpers for reading Stripe billing-period data across API versions.
 *
 * Stripe's Basil release (2025-03-31) moved `current_period_start` and
 * `current_period_end` off the Subscription object and onto its items, and
 * moved `invoice.subscription` into `invoice.parent.subscription_details`.
 *
 * Our Stripe SDK (v17) pins `Stripe-Version: 2025-02-24.acacia` on every
 * outbound request, so SDK responses keep the old, subscription-level fields.
 * Webhook payloads however are rendered with the account's API version
 * (currently 2026-08-26.dahlia), so they only carry the new, item-level
 * fields. Every reader below therefore tries the new shape first and falls
 * back to the old one, so the code works with either payload version.
 */

type PeriodSource = {
  current_period_start?: number;
  current_period_end?: number;
};

type InvoiceParentSource = {
  parent?: {
    type?: string;
    subscription_details?: {
      subscription?: string | null;
    };
  };
};

export type SubscriptionPeriod = {
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
};

/**
 * Read the current billing period of a subscription.
 *
 * Returns null when neither shape carries the period, so callers can react
 * instead of writing an `Invalid Date` to the database.
 */
export function getSubscriptionPeriod(
  subscription: Stripe.Subscription,
): SubscriptionPeriod | null {
  const item = subscription.items.data[0] as PeriodSource | undefined;
  const sub = subscription as unknown as PeriodSource;

  const start = item?.current_period_start ?? sub.current_period_start;
  const end = item?.current_period_end ?? sub.current_period_end;

  if (typeof start !== "number" || typeof end !== "number") {
    return null;
  }

  const currentPeriodStart = new Date(start * 1000);
  const currentPeriodEnd = new Date(end * 1000);

  if (
    Number.isNaN(currentPeriodStart.getTime()) ||
    Number.isNaN(currentPeriodEnd.getTime())
  ) {
    return null;
  }

  return { currentPeriodStart, currentPeriodEnd };
}

/**
 * Resolve the subscription an invoice belongs to.
 *
 * Basil+ exposes it as `invoice.parent.subscription_details.subscription`;
 * older payloads use the top-level `invoice.subscription`.
 */
export function getInvoiceSubscriptionId(
  invoice: Stripe.Invoice,
): string | null {
  const parent = (invoice as unknown as InvoiceParentSource).parent;
  const fromParent = parent?.subscription_details?.subscription;

  if (fromParent) {
    return fromParent;
  }

  // Older payloads use the top-level field, which is expanded on some
  // responses and is a plain id on others.
  const legacy = invoice.subscription;

  return typeof legacy === "string" ? legacy : legacy?.id ?? null;
}

/**
 * Map a Stripe subscription status onto our membership status.
 *
 * Returns null when the status has no direct equivalent (past_due, unpaid,
 * paused, incomplete) so the caller leaves the stored status untouched rather
 * than treating an unpaid subscription as active.
 */
export function mapStripeStatus(
  status: Stripe.Subscription.Status,
): MembershipStatus | null {
  switch (status) {
    case "active":
    case "trialing":
      return MembershipStatus.ACTIVE;
    case "canceled":
      return MembershipStatus.CANCELLED;
    case "incomplete_expired":
      return MembershipStatus.EXPIRED;
    default:
      return null;
  }
}
