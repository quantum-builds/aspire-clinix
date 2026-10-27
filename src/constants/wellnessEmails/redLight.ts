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

export const RED_LIGHT_PRE_SUBJECT =
  "Preparing for your red light therapy session";

export function redLightPreEmail({
  firstName,
  date,
  time,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Preparing for Your Red Light Therapy Session",
    greeting(firstName) +
      paragraph(
        "Thank you for booking with Aspire Wellness. We look forward to welcoming you. Here is everything you need to know before your visit.",
      ) +
      bookingDetails({
        treatment: "Full Body Red Light Therapy",
        date,
        time,
        allow:
          "around 40 minutes for your visit, including time to change and relax afterwards.",
      }) +
      paragraph(
        "<em>Short on time? Your 10 minute red light session is the essential part, so simply let us know and we can keep the rest of your visit as brief as you like.</em>",
      ) +
      sectionHeading("What to Expect") +
      paragraph(
        "After changing into a robe, you will enjoy 10 minutes on our full body Red Light Therapy bed. Specific wavelengths of red and near infrared light are absorbed by the mitochondria, the energy producing engines of our cells, and the treatment itself is warm, silent and deeply calming.",
      ) +
      paragraph(
        "You simply lie back and rest. Many guests find it profoundly peaceful, as body and mind settle together. Our team will be close by throughout, and you can end the session at any time.",
      ) +
      sectionHeading("How to Prepare") +
      numberedList([
        {
          title: "Arrive 10 minutes early.",
          text: "This gives you time to settle in and complete a short health check.",
        },
        {
          title: "Choose what to wear.",
          text: "You can enjoy the bed in your swimwear or underwear, whichever you are most comfortable in.",
        },
        {
          title: "Keep your skin product free.",
          text: "Please avoid applying lotions, oils or creams on the day of your session.",
        },
        {
          title: "Remove jewellery.",
          text: "Please leave watches, rings and other metal items in your locker.",
        },
        {
          title: "Hydrate.",
          text: "Drink plenty of water through the day.",
        },
      ]) +
      paragraph("We provide a robe and slippers.") +
      sectionHeading("Your Health Check") +
      paragraph(
        "Before your session, our team will ask a few questions about your health. Please let us know in advance if you are pregnant, are sensitive to light or take medication that increases light sensitivity, or have recently been unwell. This helps us confirm red light therapy is right for you.",
      ) +
      changeBooking() +
      signOff(),
  );
}
