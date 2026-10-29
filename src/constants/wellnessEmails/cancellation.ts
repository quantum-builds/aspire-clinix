import {
  bookingRows,
  bookNextSession,
  greeting,
  paragraph,
  signOff,
  wellnessEmailLayout,
} from "./layout";

export const CANCELLATION_REFUND_SUBJECT =
  "Your appointment has been cancelled and refunded";

/** Sent when a paid wellness appointment or session is cancelled and refunded. */
export function cancellationRefundEmail({
  firstName,
  treatment,
  date,
  time,
  amount,
}: {
  firstName?: string;
  treatment: string;
  date: string;
  time: string;
  amount: string;
}): string {
  return wellnessEmailLayout(
    "Your Appointment Has Been Cancelled",
    greeting(firstName) +
      paragraph("Your appointment with Aspire Wellness has been cancelled.") +
      bookingRows([
        { label: "Treatment", value: treatment },
        { label: "Date and time", value: `${date} at ${time}` },
      ]) +
      paragraph(
        `A refund of <strong>${amount}</strong> has been issued to your original payment method and should appear within 5 to 10 working days.`,
      ) +
      bookNextSession() +
      signOff(),
  );
}
