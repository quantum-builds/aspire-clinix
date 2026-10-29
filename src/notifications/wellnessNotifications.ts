import { formatInTimeZone } from "date-fns-tz";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
import {
  SESSION_BOOKING_EMAILS,
  SESSION_POST_EMAILS,
  WELLNESS_BOOKING_EMAILS,
  WELLNESS_POST_EMAILS,
  WellnessBookingEmail,
} from "@/constants/wellnessEmails";
import {
  CANCELLATION_REFUND_SUBJECT,
  cancellationRefundEmail,
} from "@/constants/wellnessEmails/cancellation";
import { TIMEZONE } from "@/utils/slotSelectionUtils";

/**
 * Sends the treatment's pre-booking email, if it has one. Never throws, so it
 * is safe to call after a booking (including from the Stripe webhook).
 */
export async function notifyWellnessBooking({
  treatmentId,
  patientDentallyId,
  startTime,
}: {
  treatmentId: string | number | undefined;
  patientDentallyId: number;
  startTime: string | Date;
}): Promise<void> {
  const email = WELLNESS_BOOKING_EMAILS[Number(treatmentId)];
  if (!email) {
    console.warn(
      "[WellnessNotifications] No booking email for treatmentId:",
      treatmentId,
    );
    return;
  }

  await sendBookingEmail(email, patientDentallyId, new Date(startTime));
}

/**
 * Same as notifyWellnessBooking, for admin-managed session treatments
 * (Breathwork, ...) identified by their Treatment row id. Never throws.
 */
export async function notifyTreatmentSessionBooking({
  treatmentId,
  patientDentallyId,
  startTime,
  endTime,
}: {
  treatmentId: string;
  patientDentallyId: number;
  startTime: Date;
  endTime: Date;
}): Promise<void> {
  try {
    const treatment = await prisma.treatment.findUnique({
      where: { id: treatmentId },
      select: { name: true },
    });
    if (!treatment) return;

    const email = SESSION_BOOKING_EMAILS.find(({ matches }) =>
      matches(treatment.name),
    )?.email;
    if (!email) return;

    await sendBookingEmail(email, patientDentallyId, startTime, endTime);
  } catch (err) {
    console.error("[WellnessNotifications] Failed to send session email:", err);
  }
}

/**
 * Sends the treatment's post email when a wellness appointment is marked
 * Completed. Only appointments recorded in WellnessAppointment are wellness.
 * Never throws.
 */
export async function notifyWellnessCompleted(
  appointmentId: string,
  appointment: { patientId?: number | string; startTime?: string } | null,
): Promise<void> {
  try {
    const wellnessAppointment = await prisma.wellnessAppointment.findUnique({
      where: { appointmentId },
      select: { treatmentId: true },
    });
    if (!wellnessAppointment) return;

    const email = WELLNESS_POST_EMAILS[Number(wellnessAppointment.treatmentId)];
    if (!email) {
      console.warn(
        "[WellnessNotifications] No post email for treatmentId:",
        wellnessAppointment.treatmentId,
      );
      return;
    }

    if (!appointment?.patientId || !appointment.startTime) {
      console.warn(
        "[WellnessNotifications] Completed appointment missing patient or time:",
        appointmentId,
      );
      return;
    }

    await sendBookingEmail(
      email,
      Number(appointment.patientId),
      new Date(appointment.startTime),
    );
  } catch (err) {
    console.error("[WellnessNotifications] Failed to send post email:", err);
  }
}

/**
 * Sends the post email when an admin-managed session (Breathwork, ...) is
 * marked Completed. Matched on treatment name, like the session pre email.
 * Never throws.
 */
export async function notifySessionCompleted(session: {
  treatmentId: string;
  patientId: number;
  startTime: Date;
  endTime: Date;
}): Promise<void> {
  try {
    const treatment = await prisma.treatment.findUnique({
      where: { id: session.treatmentId },
      select: { name: true },
    });
    if (!treatment) return;

    const email = SESSION_POST_EMAILS.find(({ matches }) =>
      matches(treatment.name),
    )?.email;
    if (!email) {
      console.warn(
        "[WellnessNotifications] No post email for session treatment:",
        treatment.name,
      );
      return;
    }

    await sendBookingEmail(
      email,
      session.patientId,
      session.startTime,
      session.endTime,
    );
  } catch (err) {
    console.error("[WellnessNotifications] Failed to send session post email:", err);
  }
}

/**
 * Tells the patient a cancelled appointment or session was refunded.
 * Never throws.
 */
export async function notifyCancellationRefund({
  patientDentallyId,
  treatment,
  startTime,
  amount,
  currency,
}: {
  patientDentallyId: number;
  treatment: string;
  startTime: Date | null;
  amount: number;
  currency: string;
}): Promise<void> {
  try {
    const patient = await prisma.patient.findUnique({
      where: { dentallyId: patientDentallyId },
      select: { email: true, name: true },
    });

    if (!patient?.email) {
      console.warn(
        "[WellnessNotifications] No patient email for refund, dentallyId:",
        patientDentallyId,
      );
      return;
    }

    await sendEmail({
      to: patient.email,
      subject: CANCELLATION_REFUND_SUBJECT,
      html: cancellationRefundEmail({
        firstName: patient.name.trim().split(/\s+/)[0],
        treatment,
        date: startTime
          ? formatInTimeZone(startTime, TIMEZONE, "EEEE d MMMM yyyy")
          : "your booked date",
        time: startTime ? formatInTimeZone(startTime, TIMEZONE, "h:mm a") : "",
        amount: new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: currency.toUpperCase(),
        }).format(amount / 100),
      }),
      sender: "wellness",
    });
  } catch (err) {
    console.error("[WellnessNotifications] Failed to send refund email:", err);
  }
}

async function sendBookingEmail(
  email: WellnessBookingEmail,
  patientDentallyId: number,
  start: Date,
  end?: Date,
): Promise<void> {
  try {
    const patient = await prisma.patient.findUnique({
      where: { dentallyId: patientDentallyId },
      select: { email: true, name: true },
    });

    if (!patient?.email) {
      console.warn(
        "[WellnessNotifications] No patient email for dentallyId:",
        patientDentallyId,
      );
      return;
    }

    await sendEmail({
      to: patient.email,
      subject: email.subject,
      html: email.build({
        firstName: patient.name.trim().split(/\s+/)[0],
        date: formatInTimeZone(start, TIMEZONE, "EEEE d MMMM yyyy"),
        time: formatInTimeZone(start, TIMEZONE, "h:mm a"),
        duration: end ? formatDuration(start, end) : undefined,
      }),
      sender: "wellness",
    });
  } catch (err) {
    console.error("[WellnessNotifications] Failed to send booking email:", err);
  }
}

function formatDuration(start: Date, end: Date): string | undefined {
  const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
  if (minutes <= 0) return undefined;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const parts = [
    hours ? `${hours} hour${hours > 1 ? "s" : ""}` : "",
    rest ? `${rest} minutes` : "",
  ].filter(Boolean);

  return parts.join(" ");
}
