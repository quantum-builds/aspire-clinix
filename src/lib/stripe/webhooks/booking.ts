import type Stripe from "stripe";
import { fromZonedTime } from "date-fns-tz";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe/client";
import { createAppointment } from "@/dentallyHelpers/appointment";
import { CreateAppointment } from "@/types/appointment";
import {
  reserveTreatmentSlot,
  TreatmentSlotException,
} from "@/lib/treatment-session";
import { TIMEZONE } from "@/utils/slotSelectionUtils";
import {
  notifyTreatmentSessionBooking,
  notifyWellnessBooking,
} from "@/notifications/wellnessNotifications";
import { HandlerResult, ok, rejected, RetryableWebhookError } from "./result";

/**
 * `checkout.session.completed` with `payment_for=wellness_appointment`:
 * the patient paid for a Dentally appointment, so create it in Dentally.
 *
 * Duplicate deliveries are stopped by the event-id claim in the dispatcher.
 */
export async function onWellnessAppointmentPaid(
  session: Stripe.Checkout.Session,
): Promise<HandlerResult> {
  const metadata = session.metadata ?? {};
  const { start_time, finish_time, practitioner_id, patient_id, reason } =
    metadata;

  if (!start_time || !finish_time || !practitioner_id || !patient_id) {
    console.error("Missing Dentally appointment metadata:", metadata);
    return rejected("Missing required appointment metadata");
  }

  if (session.payment_status !== "paid") {
    console.warn(
      "Wellness checkout completed but not paid:",
      session.id,
      session.payment_status,
    );
    return ok("Webhook received but payment is not yet paid");
  }

  const startTime = new Date(start_time);
  const finishTime = new Date(finish_time);

  if (Number.isNaN(startTime.getTime()) || Number.isNaN(finishTime.getTime())) {
    console.error("Invalid appointment date/time:", { start_time, finish_time });
    return rejected("Invalid appointment date/time");
  }

  if (finishTime <= startTime) {
    console.error("Invalid appointment time range:", { start_time, finish_time });
    return rejected("Finish time must be after start time");
  }

  const appointmentData: CreateAppointment = {
    startTime,
    finishTime,
    practitionerId: Number(practitioner_id),
    patientId: Number(patient_id),
    reason: reason || "Wellness Appointment",
  };

  if (
    Number.isNaN(appointmentData.practitionerId) ||
    Number.isNaN(appointmentData.patientId)
  ) {
    return rejected("Invalid practitioner or patient ID");
  }

  console.log("Creating Dentally appointment:", session.id, appointmentData);

  const result = await createAppointment(appointmentData);

  if (result.isError) {
    // Retry: the patient has paid, so the appointment must be created.
    throw new RetryableWebhookError(
      "Payment succeeded but Dentally appointment creation failed",
      result.response,
    );
  }

  console.log("Dentally appointment created:", session.id, result.response?.id);

  await notifyWellnessBooking({
    treatmentId: metadata.treatment_id,
    patientDentallyId: Number(patient_id),
    startTime,
  });

  return ok("Dentally appointment created");
}

/**
 * `checkout.session.completed` with `payment_for=treatment_session`:
 * the patient paid for a slot on an admin-managed treatment (Breathwork,
 * Contrast, ...). Reserve the slot and create the Session. If the slot can no
 * longer be booked, refund the payment.
 */
export async function onTreatmentSessionPaid(
  session: Stripe.Checkout.Session,
): Promise<HandlerResult> {
  const metadata = session.metadata ?? {};
  const { treatment_id, patient_id, date, start_time } = metadata;

  if (!treatment_id || !patient_id || !date || !start_time) {
    console.error("Missing treatment session metadata:", metadata);
    return rejected("Missing required session metadata");
  }

  if (session.payment_status !== "paid") {
    console.warn(
      "Treatment session checkout completed but not paid:",
      session.id,
      session.payment_status,
    );
    return ok("Webhook received but payment is not yet paid");
  }

  const dentallyId = Number(patient_id);
  const patient = await prisma.patient.findUnique({ where: { dentallyId } });

  if (!patient) {
    console.error("Patient not found for treatment session:", patient_id);
    return rejected("Patient not found");
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      // Second line of defence after the event-id claim. Runs before slot
      // validation, since our own earlier booking may have filled the slot.
      const duplicate = await tx.session.findFirst({
        where: {
          patientId: dentallyId,
          treatmentId: treatment_id,
          startTime: fromZonedTime(`${date}T${start_time}:00`, TIMEZONE),
        },
      });

      if (duplicate) {
        return null;
      }

      const { treatment, start, end } = await reserveTreatmentSlot(
        tx,
        treatment_id,
        date,
        start_time,
      );

      return tx.session.create({
        data: {
          patientId: dentallyId,
          patientName: patient.name,
          practitionerId: treatment.practitionerId
            ? Number(treatment.practitionerId)
            : null,
          practitionerName: treatment.practitionerName,
          treatmentId: treatment_id,
          startTime: start,
          endTime: end,
        },
      });
    });

    if (!created) {
      console.log("Treatment session already exists, skipping:", session.id);
      return ok("Treatment session already exists");
    }

    console.log("Treatment session created:", created.id);

    await notifyTreatmentSessionBooking({
      treatmentId: treatment_id,
      patientDentallyId: dentallyId,
      startTime: created.startTime,
      endTime: created.endTime,
    });
    return ok("Treatment session created");
  } catch (error) {
    if (
      error instanceof TreatmentSlotException &&
      error.code !== "SLOT_CONFLICT"
    ) {
      // The slot can no longer be booked (full, removed or in the past), so
      // return the payment instead of creating a session.
      console.error(
        "Treatment slot unavailable after payment, refunding:",
        session.id,
        error.code,
      );

      if (session.payment_intent) {
        await stripe.refunds.create(
          {
            payment_intent:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent.id,
          },
          // A retried event must not try to refund twice.
          { idempotencyKey: `refund-slot-unavailable-${session.id}` },
        );
      }

      return ok("Slot unavailable, payment refunded");
    }

    if (error instanceof TreatmentSlotException) {
      // SLOT_CONFLICT: a concurrent booking changed the slot; try again.
      throw new RetryableWebhookError("Treatment slot conflict", error.code);
    }

    throw error;
  }
}
