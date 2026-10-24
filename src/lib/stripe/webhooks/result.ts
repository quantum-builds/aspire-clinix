/**
 * What a webhook handler tells the dispatcher.
 *
 * - `ok`:        handled or deliberately ignored. Responds 200, event is
 *                marked processed.
 * - `rejected`:  a permanent problem (bad metadata, unknown patient). Responds
 *                400 so the failure shows in the Stripe dashboard, and the
 *                event is marked processed so Stripe's retries are skipped.
 * - throwing:    a transient problem (Dentally down, DB error). Responds 500
 *                and the claim is released, so Stripe's retry runs it again.
 */
export type HandlerResult =
  | { outcome: "ok"; message: string; data?: unknown }
  | { outcome: "rejected"; message: string; data?: unknown };

export const ok = (message: string, data?: unknown): HandlerResult => ({
  outcome: "ok",
  message,
  data,
});

export const rejected = (message: string, data?: unknown): HandlerResult => ({
  outcome: "rejected",
  message,
  data,
});

/** A transient failure that Stripe should retry. */
export class RetryableWebhookError extends Error {
  constructor(
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}
