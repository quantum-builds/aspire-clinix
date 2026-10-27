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

export const ICE_BATH_PRE_SUBJECT = "Preparing for your ice bath";

export function iceBathPreEmail({
  firstName,
  date,
  time,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Preparing for Your Ice Bath",
    greeting(firstName) +
      paragraph(
        "Thank you for booking with Aspire Wellness. We look forward to welcoming you. Here is everything you need to know before your visit.",
      ) +
      bookingDetails({
        treatment: "Ice Bath",
        date,
        time,
        allow:
          "around 40 minutes for your visit, including time to change, relax and shower afterwards.",
      }) +
      paragraph(
        "<em>Short on time? Your three minute ice bath is the essential part, so simply let us know and we can keep the rest of your visit as brief as you like.</em>",
      ) +
      sectionHeading("What to Expect") +
      paragraph(
        "You will spend around three minutes in our ice bath. Our team will guide you through your breathing as you enter the water and will be with you throughout. You can end the session at any time.",
      ) +
      paragraph(
        "The aim of cold immersion is to prompt a short adaptive response from the body, and this can begin well within three minutes. You are welcome to keep your time in the water as short as feels right for you; for most people, around three minutes works well.",
      ) +
      sectionHeading("How to Prepare") +
      numberedList([
        {
          title: "Arrive 10 minutes early.",
          text: "This gives you time to settle in and complete a short health check.",
        },
        {
          title: "Bring swimwear.",
          text: "You will need swimwear for the ice bath.",
        },
        {
          title: "Remove jewellery.",
          text: "Please leave watches, rings and other metal items in your locker.",
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
        "We provide towels, a robe and slippers, and shower facilities for afterwards.",
      ) +
      sectionHeading("Your Health Check") +
      paragraph(
        "Before your session, our team will ask a few questions about your health. Please let us know in advance if you are pregnant, have a heart or circulation condition, high blood pressure, Raynaud's or sensitivity to cold, or have recently been unwell. This helps us confirm the ice bath is right for you.",
      ) +
      changeBooking() +
      signOff(),
  );
}
