import Stripe from "stripe";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe/client";
import { notifyCancellationRefund } from "@/notifications/wellnessNotifications";

export type RefundReason =
  | "patient_cancel"
  | "clinic_cancel"
  | "slot_unavailable";

export type RefundOutcome =
  | { status: "refunded"; amount: number; currency: string }
  | { status: "already_handled" }
  | { status: "failed"; error: string };

/** A refund that may work if tried again (network, Stripe outage, rate limit). */
export class RetryableRefundError extends Error {}

const TRANSIENT_STRIPE_ERRORS = new Set([
  "StripeConnectionError",
  "StripeAPIError",
  "StripeRateLimitError",
]);

/**
 * Refunds a cancelled paid Dentally appointment, if it has a payment, and
 * emails the patient. Called by the Dentally webhook and by the in-app cancel;
 * whichever runs second finds the refund already handled. The reason comes
 * from `cancelledBy`, which the app stamps before cancelling in Dentally
 * (unset = cancelled directly in Dentally by the clinic).
 *
 * Throws RetryableRefundError on a transient Stripe failure.
 */
export async function refundCancelledDentallyAppointment(
  dentallyAppointmentId: string,
  appointment: {
    patientDentallyId?: number | null;
    reason?: string | null;
    startTime?: string | null;
  } = {},
): Promise<RefundOutcome | null> {
  const payment = await prisma.appointmentPayment.findUnique({
    where: { dentallyAppointmentId },
  });

  if (!payment) {
    console.log(`Dentally appointment ${dentallyAppointmentId}: no payment to refund`);
    return null;
  }

  if (
    appointment.patientDentallyId &&
    payment.patientDentallyId !== appointment.patientDentallyId
  ) {
    console.warn(
      `Dentally appointment ${dentallyAppointmentId}: payment patient mismatch, not refunded`,
    );
    return null;
  }

  const outcome = await refundAppointmentPayment(
    payment.id,
    payment.cancelledBy === "PATIENT" ? "patient_cancel" : "clinic_cancel",
  );

  if (outcome.status === "refunded") {
    await notifyCancellationRefund({
      patientDentallyId: payment.patientDentallyId,
      treatment: appointment.reason || "Wellness appointment",
      startTime: appointment.startTime ? new Date(appointment.startTime) : null,
      amount: outcome.amount,
      currency: outcome.currency,
    });
  }

  return outcome;
}

/**
 * Fully refunds the payment behind an AppointmentPayment row. Safe to call
 * any number of times: the NONE -> PENDING claim lets only one caller reach
 * Stripe, and the idempotency key makes a repeated Stripe call a no-op.
 *
 * A permanent Stripe error marks the row FAILED and returns (a human has to
 * look; retrying will not help). A transient error resets the row to NONE and
 * throws RetryableRefundError so the caller's webhook gets retried.
 */
export async function refundAppointmentPayment(
  paymentId: string,
  reason: RefundReason,
): Promise<RefundOutcome> {
  const claim = await prisma.appointmentPayment.updateMany({
    where: { id: paymentId, refundStatus: "NONE" },
    data: { refundStatus: "PENDING", refundReason: reason },
  });

  if (claim.count === 0) {
    console.log(`Refund for payment ${paymentId}: already handled`);
    return { status: "already_handled" };
  }

  const payment = await prisma.appointmentPayment.findUniqueOrThrow({
    where: { id: paymentId },
  });

  const idempotencyKey =
    payment.kind === "TREATMENT_SESSION"
      ? `refund-session-${payment.sessionId}`
      : `refund-appointment-${payment.dentallyAppointmentId}`;

  try {
    const refund = await stripe.refunds.create(
      {
        payment_intent: payment.stripePaymentIntentId,
        metadata: { appointment_payment_id: payment.id, reason },
      },
      { idempotencyKey },
    );

    // The refund.* webhook may already have recorded this refund; only
    // move forward from PENDING.
    await prisma.appointmentPayment.updateMany({
      where: { id: payment.id, refundStatus: "PENDING" },
      data: {
        refundStatus: refund.status === "failed" ? "FAILED" : "REFUNDED",
        stripeRefundId: refund.id,
        refundedAt: new Date(refund.created * 1000),
        refundError: refund.failure_reason ?? null,
      },
    });

    console.log(
      `Refund for payment ${payment.id}: ${refund.id} (${refund.status}), ` +
        `${refund.amount} ${refund.currency}, reason=${reason}`,
    );

    return {
      status: "refunded",
      amount: refund.amount,
      currency: refund.currency,
    };
  } catch (error) {
    const stripeError =
      error instanceof Stripe.errors.StripeError ? error : null;

    if (!stripeError || TRANSIENT_STRIPE_ERRORS.has(stripeError.type)) {
      await prisma.appointmentPayment.update({
        where: { id: payment.id },
        data: { refundStatus: "NONE", refundReason: null },
      });

      throw new RetryableRefundError(
        `Refund for payment ${payment.id} failed, will retry: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    if (stripeError.code === "charge_already_refunded") {
      // Refunded by hand in the dashboard; the refund.* webhook fills in the
      // refund ID.
      await prisma.appointmentPayment.update({
        where: { id: payment.id },
        data: { refundStatus: "REFUNDED", refundedAt: new Date() },
      });
      return { status: "already_handled" };
    }

    await prisma.appointmentPayment.update({
      where: { id: payment.id },
      data: { refundStatus: "FAILED", refundError: stripeError.message },
    });

    console.error(
      `REFUND FAILED for payment ${payment.id} (PI ${payment.stripePaymentIntentId}). ` +
        "Needs manual action in the Stripe dashboard:",
      stripeError.type,
      stripeError.code,
      stripeError.message,
    );

    return { status: "failed", error: stripeError.message };
  }
}
