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

export const INFRARED_SAUNA_PRE_SUBJECT =
  "Preparing for your infrared sauna session";

export function infraredSaunaPreEmail({
  firstName,
  date,
  time,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Preparing for Your Infrared Sauna Session",
    greeting(firstName) +
      paragraph(
        "Thank you for booking with Aspire Wellness. We look forward to welcoming you. Here is everything you need to know before your visit.",
      ) +
      bookingDetails({
        treatment: "Sunlighten&reg; Infrared Sauna",
        date,
        time,
        allow:
          "around 60 to 80 minutes for your visit, depending on the length of your session, including time to change, relax and shower afterwards.",
      }) +
      paragraph(
        "<em>Short on time? Your 45 minute sauna session is the essential part, so simply let us know and we can keep the rest of your visit as brief as you like.</em>",
      ) +
      sectionHeading("What to Expect") +
      paragraph(
        "You will enjoy a session of up to 45 minutes in our medical grade Sunlighten&reg; Infrared Sauna, which combines red light with near, mid and far infrared. The sauna has a range of settings, and our team will help you choose the one that suits you best.",
      ) +
      paragraph(
        "An infrared sauna runs at a lower air temperature than a traditional sauna, so many guests find it more comfortable, while still enjoying a deep sweat. For those who enjoy the challenge of deeper heat, the sauna can also be set to a higher temperature.",
      ) +
      sectionHeading("How to Prepare") +
      numberedList([
        {
          title: "Arrive 10 minutes early.",
          text: "This gives you time to settle in and complete a short health check.",
        },
        {
          title: "Hydrate well.",
          text: "Drink plenty of water in the hours before your session. This is the most important step. Water is also available throughout your session.",
        },
        {
          title: "Eat lightly.",
          text: "A light meal an hour or two beforehand is ideal; avoid a heavy meal just before.",
        },
        {
          title: "Avoid alcohol",
          text: "on the day of your session.",
        },
        {
          title: "Skip heavy lotions.",
          text: "Clean, product free skin allows you to sweat freely.",
        },
      ]) +
      paragraph(
        "We provide towels, a robe and slippers, and shower facilities for afterwards.",
      ) +
      sectionHeading("Your Health Check") +
      paragraph(
        "Before your session, our team will ask a few questions about your health. Please let us know in advance if you are pregnant, have a heart condition, high or low blood pressure, or have recently been unwell. This helps us confirm the sauna is right for you.",
      ) +
      changeBooking() +
      signOff(),
  );
}
