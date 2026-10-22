import Stripe from "stripe";

/**
 * The Stripe SDK (v17) pins `Stripe-Version: 2025-02-24.acacia` on every
 * outbound request, so responses still carry the subscription-level
 * `current_period_start` / `current_period_end` fields.
 *
 * Webhook payloads are rendered with the account's API version instead
 * (currently 2026-08-26.dahlia), where those fields moved onto the
 * subscription item and `invoice.subscription` moved into
 * `invoice.parent.subscription_details`.
 *
 * Always read billing periods through `getSubscriptionPeriod()` in
 * `src/lib/stripe-period.ts`, which handles both shapes.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
