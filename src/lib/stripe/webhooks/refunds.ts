import type Stripe from "stripe";
import { RefundStatus } from "@prisma/client";
import prisma from "@/lib/db";
import { idOf } from "@/lib/stripe/ids";
import { HandlerResult, ok } from "./result";

/**
 * `refund.created`, `refund.updated`, `refund.failed`: records the outcome of
 * a refund on its AppointmentPayment. Covers refunds made by
 * refundAppointmentPayment and refunds staff make by hand in the dashboard.
 *
 * Refunds for payments we do not know (other apps on the shared account,
 * memberships) are ignored with a 200.
 */
export async function onRefundEvent(
  refund: Stripe.Refund,
): Promise<HandlerResult> {
  const paymentIntent = idOf(refund.payment_intent);

  if (!paymentIntent) {
    return ok("Refund without payment intent, ignored");
  }

  const payment = await prisma.appointmentPayment.findUnique({
    where: { stripePaymentIntentId: paymentIntent },
  });

  if (!payment) {
    return ok("Refund for a payment not handled by this app, ignored");
  }

  if (payment.stripeRefundId && payment.stripeRefundId !== refund.id) {
    console.warn(
      `Second refund ${refund.id} on payment ${payment.id} (already ${payment.stripeRefundId}), not recorded`,
    );
    return ok("Additional refund on an already refunded payment, ignored");
  }

  const status = mapRefundStatus(refund.status);

  // Events can arrive out of order; never move a finished refund back to
  // pending.
  if (status === "PENDING" && payment.refundStatus !== "NONE" && payment.refundStatus !== "PENDING") {
    return ok(`Refund ${refund.id} already ${payment.refundStatus}`);
  }

  await prisma.appointmentPayment.update({
    where: { id: payment.id },
    data: {
      refundStatus: status,
      stripeRefundId: refund.id,
      refundedAt: new Date(refund.created * 1000),
      refundReason: payment.refundReason ?? "dashboard",
      refundError:
        status === "FAILED" ? refund.failure_reason ?? refund.status : null,
    },
  });

  if (status === "FAILED") {
    console.error(
      `REFUND FAILED for payment ${payment.id} (refund ${refund.id}): ${refund.failure_reason ?? refund.status}`,
    );
  }

  return ok(`Refund ${refund.id} recorded as ${status}`);
}

function mapRefundStatus(status: string | null): RefundStatus {
  switch (status) {
    case "succeeded":
      return "REFUNDED";
    case "failed":
    case "canceled":
      return "FAILED";
    default:
      return "PENDING";
  }
}
