import {
  bookingRows,
  changeBooking,
  greeting,
  numberedList,
  paragraph,
  sectionHeading,
  signOff,
  wellnessEmailLayout,
} from "./layout";
import type { WellnessBookingEmailData } from "./types";

export const BREATHWORK_PRE_SUBJECT = "Preparing for your breathwork session";

export function breathworkPreEmail({
  firstName,
  date,
  time,
  duration,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Preparing for Your Breathwork Session",
    greeting(firstName) +
      paragraph(
        "Thank you for booking with Aspire Wellness. We look forward to welcoming you. Here is everything you need to know before your session.",
      ) +
      bookingRows([
        { label: "Session", value: "Guided Breathwork" },
        { label: "Date and time", value: `${date} at ${time}` },
        ...(duration ? [{ label: "Duration", value: duration }] : []),
      ]) +
      sectionHeading("What to Expect") +
      paragraph(
        "Our breathwork sessions are held in a small group and guided by our specialist breathwork practitioner. You will be led through a series of deliberate, structured breathing patterns, lying or sitting comfortably throughout.",
      ) +
      paragraph(
        "There is no experience needed, and you can go at your own pace. If you would like to slow down or pause at any point, simply return to your natural breath.",
      ) +
      sectionHeading("How to Prepare") +
      numberedList([
        {
          title: "Arrive 10 minutes early.",
          text: "This gives you time to settle in before the session begins.",
        },
        {
          title: "Wear comfortable clothing.",
          text: "Loose, comfortable clothing you can lie down in is ideal.",
        },
        {
          title: "Eat lightly.",
          text: "Please avoid a heavy meal in the two hours before your session.",
        },
        {
          title: "Hydrate.",
          text: "Drink plenty of water through the day, and feel free to bring a water bottle.",
        },
        {
          title: "Avoid alcohol",
          text: "on the day of your session.",
        },
      ]) +
      paragraph("We provide mats, cushions and blankets.") +
      sectionHeading("Your Health Check") +
      paragraph(
        "Please let us know in advance if you are pregnant, have a heart condition or high blood pressure, epilepsy, asthma or another breathing condition, a history of panic attacks, or have had recent surgery. This helps us make sure the session is right for you.",
      ) +
      changeBooking() +
      signOff(),
  );
}
