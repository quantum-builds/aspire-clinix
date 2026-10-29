import Stripe from "stripe";

/**
 * The single server-side Stripe client.
 *
 * The SDK (v17) pins `Stripe-Version: 2025-02-24.acacia` on every outbound
 * request, so SDK responses carry the subscription-level
 * `current_period_start` / `current_period_end` fields.
 *
 * The production webhook endpoint is pinned to the same version. Payloads
 * from endpoints on the account default (2026-08-26.dahlia) carry those
 * fields on the subscription item instead, and `invoice.subscription` moves
 * into `invoice.parent.subscription_details`.
 *
 * Always read billing periods through `getSubscriptionPeriod()` in
 * `src/lib/stripe-period.ts`, which handles both shapes.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.trim() as string);
