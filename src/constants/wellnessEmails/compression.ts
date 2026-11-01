import {
  bookingDetails,
  bookNextSession,
  bulletList,
  changeBooking,
  greeting,
  numberedList,
  paragraph,
  sectionHeading,
  signOff,
  wellnessEmailLayout,
} from "./layout";
import type { WellnessBookingEmailData } from "./types";

export const COMPRESSION_POST_SUBJECT = "Your compression therapy aftercare";

export function compressionPostEmail({
  firstName,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Your Compression Therapy Aftercare",
    greeting(firstName) +
      paragraph(
        "Thank you for visiting Aspire Wellness today. Here is a short guide to help you get the most from your compression therapy session.",
      ) +
      sectionHeading("What You Had Today") +
      paragraph(
        "A 20 minute session of intermittent compression therapy. Gentle, sequential compression stimulates venous and lymphatic return, helping to improve circulation and reduce lower limb fatigue.",
      ) +
      sectionHeading("What You May Notice (All Normal)") +
      bulletList([
        "Legs feeling lighter and less tired",
        "Feeling calm, relaxed and settled",
        "Mild tingling in the legs, which usually fades within a short time",
      ]) +
      sectionHeading("Your Aftercare for the Rest of Today") +
      numberedList([
        {
          title: "Hydrate.",
          text: "Drink water through the rest of the day.",
        },
        {
          title: "Keep moving gently.",
          text: "A short walk helps keep your circulation flowing.",
        },
        {
          title: "Carry on as normal.",
          text: "There is no downtime, so you can return to your day straight away.",
        },
      ]) +
      sectionHeading("Please Avoid") +
      bulletList([
        "Sitting still for long periods straight after your session",
      ]) +
      sectionHeading("Before Your Next Session") +
      paragraph(
        "If anything changes with your health or medication, please let us know before you book again, so we can confirm compression therapy is still right for you.",
      ) +
      sectionHeading("Make the Most of It") +
      paragraph(
        "Compression therapy is also part of our Recovery Bundle, alongside cryotherapy, the infrared sauna and red light therapy, for £175.",
      ) +
      bookNextSession() +
      signOff(),
  );
}
