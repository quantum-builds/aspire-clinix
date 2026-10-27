import { formatInTimeZone } from "date-fns-tz";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
import {
  SESSION_BOOKING_EMAILS,
  WELLNESS_BOOKING_EMAILS,
  WellnessBookingEmail,
} from "@/constants/wellnessEmails";
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
    console.log(
      `[WellnessNotifications] Booking email sent to ${patient.email} (${email.subject})`,
    );
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
