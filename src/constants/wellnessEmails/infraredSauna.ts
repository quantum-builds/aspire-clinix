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

export const INFRARED_SAUNA_POST_SUBJECT = "Your infrared sauna aftercare";

export function infraredSaunaPostEmail({
  firstName,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Your Infrared Sauna Aftercare",
    greeting(firstName) +
      paragraph(
        "Thank you for visiting Aspire Wellness today. Here is a short guide to help you get the most from your infrared sauna session.",
      ) +
      sectionHeading("What You Had Today") +
      paragraph(
        "A session in our medical grade Sunlighten&reg; Infrared Sauna, combining red light with near, mid and far infrared.",
      ) +
      paragraph(
        "As your core temperature rises, blood vessels dilate, circulation increases and muscles begin to relax. Heat also encourages the production of Heat Shock Proteins, protective molecules that form part of the body's natural maintenance and repair systems, and growing research continues to explore their role in healthy ageing and long term wellbeing. Many guests describe leaving with looser muscles, easier joints and a real sense of renewed energy.",
      ) +
      sectionHeading("What You May Notice (All Normal)") +
      bulletList([
        "Feeling warm, and continuing to sweat lightly, for a while afterwards",
        "Flushed skin",
        "Feeling relaxed, loose and pleasantly tired",
        "Muscles and joints feeling looser and more comfortable",
      ]) +
      sectionHeading("Your Aftercare for the Rest of Today") +
      numberedList([
        {
          title: "Rehydrate.",
          text: "This is the most important step. Drink water steadily over the next few hours, ideally with electrolytes, to replace what you lost through sweating.",
        },
        {
          title: "Cool down gradually.",
          text: "Let your body return to its normal temperature at its own pace.",
        },
        {
          title: "Rinse off.",
          text: "A lukewarm shower washes away sweat, and a moisturiser afterwards keeps skin comfortable.",
        },
        {
          title: "Eat well.",
          text: "A balanced meal helps replace natural salts and minerals.",
        },
      ]) +
      sectionHeading("Please Avoid") +
      bulletList([
        "Alcohol for the rest of the day, as it adds to dehydration",
        "Intense exercise straight after your session",
        "A hot bath immediately afterwards",
      ]) +
      sectionHeading("Before Your Next Session") +
      paragraph(
        "If anything changes with your health or medication, please let us know before you book again. Please arrive well hydrated, and avoid alcohol beforehand.",
      ) +
      sectionHeading("Make the Most of It") +
      paragraph(
        "Many clients begin with cold before heat. Our Contrast Session pairs cryotherapy or an ice bath with the Sunlighten&reg; Infrared Sauna, and is included in all of our memberships.",
      ) +
      bookNextSession() +
      signOff(),
  );
}
