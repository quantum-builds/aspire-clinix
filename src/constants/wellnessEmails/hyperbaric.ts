import {
  bookingDetails,
  changeBooking,
  greeting,
  numberedList,
  paragraph,
  sectionHeading,
  signOff,
  wellnessEmailLayout,
} from "./layout";
import type { WellnessBookingEmailData } from "./types";

export const HYPERBARIC_PRE_SUBJECT =
  "Preparing for your hyperbaric oxygen session";

export function hyperbaricPreEmail({
  firstName,
  date,
  time,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Preparing for Your Hyperbaric Oxygen Session",
    greeting(firstName) +
      paragraph(
        "Thank you for booking with Aspire Wellness. We look forward to welcoming you. Here is everything you need to know before your visit.",
      ) +
      bookingDetails({
        treatment: "Hyperbaric Oxygen Therapy",
        date,
        time,
        allow:
          "around 90 minutes for your visit, including time to change and relax afterwards.",
      }) +
      paragraph(
        "<em>Short on time? Your 60 minute hyperbaric session is the essential part, so simply let us know and we can keep the rest of your visit as brief as you like.</em>",
      ) +
      sectionHeading("What to Expect") +
      paragraph(
        "After changing into a robe, you will spend 60 minutes in our hyperbaric oxygen chamber. As the pressure changes you may feel a gentle fullness in your ears, similar to a flight, and our team will show you how to clear them. Most guests find the hour deeply peaceful: read, rest or simply breathe.",
      ) +
      sectionHeading("How to Prepare") +
      numberedList([
        {
          title: "Arrive 10 minutes early.",
          text: "This gives you time to settle in and complete a short health check.",
        },
        {
          title: "Eat lightly and hydrate.",
          text: "A light meal an hour or two beforehand and plenty of water are ideal.",
        },
        {
          title: "Avoid alcohol",
          text: "on the day of your session.",
        },
      ]) +
      paragraph(
        "We provide a robe and slippers. You are welcome to bring a book, or your phone or tablet, to enjoy during your session.",
      ) +
      sectionHeading("Your Health Check") +
      paragraph(
        "Before your session, our team will ask a few questions about your health. Please let us know in advance if you are pregnant, have a cold, blocked nose, sinus or ear problem, a lung condition, have had recent surgery, or feel uncomfortable in enclosed spaces. A blocked nose can make it harder to clear your ears, so we may suggest rescheduling.",
      ) +
      changeBooking() +
      signOff(),
  );
}
