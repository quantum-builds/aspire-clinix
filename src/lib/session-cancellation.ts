import { CancelledBy, Session, Treatment } from "@prisma/client";
import prisma from "@/lib/db";
import { releaseTreatmentSlot } from "@/lib/treatment-session";
import { restoreSessionCredit } from "@/lib/membership-credits";
import {
  refundAppointmentPayment,
  RetryableRefundError,
} from "@/lib/stripe/refunds";
import { notifyCancellationRefund } from "@/notifications/wellnessNotifications";

export type SessionCancelResult = {
  cancelled: boolean;
  refund: "none" | "refunded" | "already_handled" | "failed" | "retry_needed";
};

/**
 * Cancels an admin-managed treatment session (Breathwork, ...). These are not
 * in Dentally, so this does what the Dentally webhook does for appointments:
 * frees the slot, gives back a plan credit, and refunds a paid session.
 *
 * Only the request that moves the session to CANCELLED frees the slot and
 * restores the credit. The refund is attempted on every call while the row is
 * not yet refunded, so a cancel after a transient Stripe failure retries it.
 * Callers check permissions and the 24 h rule first.
 */
export async function cancelTreatmentSession(
  session: Session & { treatment: Treatment },
  cancelledBy: CancelledBy,
): Promise<SessionCancelResult> {
  const cancelled = await prisma.$transaction(async (tx) => {
    const claim = await tx.session.updateMany({
      where: { id: session.id, status: { not: "CANCELLED" } },
      data: { status: "CANCELLED" },
    });

    if (claim.count === 0) return false;

    await releaseTreatmentSlot(tx, session.treatmentId, session.startTime);
    await restoreSessionCredit(tx, session);
    await tx.appointmentPayment.updateMany({
      where: { sessionId: session.id },
      data: { cancelledBy },
    });

    return true;
  });

  const payment = await prisma.appointmentPayment.findUnique({
    where: { sessionId: session.id },
  });

  if (!payment) return { cancelled, refund: "none" };

  try {
    const outcome = await refundAppointmentPayment(
      payment.id,
      cancelledBy === "PATIENT" ? "patient_cancel" : "clinic_cancel",
    );

    if (outcome.status === "refunded") {
      await notifyCancellationRefund({
        patientDentallyId: payment.patientDentallyId,
        treatment: session.treatment.name,
        startTime: session.startTime,
        amount: outcome.amount,
        currency: outcome.currency,
      });
    }

    return { cancelled, refund: outcome.status };
  } catch (error) {
    if (error instanceof RetryableRefundError) {
      console.error(
        `Session ${session.id} cancelled but refund must be retried:`,
        error.message,
      );
      return { cancelled, refund: "retry_needed" };
    }
    throw error;
  }
}
