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

export const HYPERBARIC_POST_SUBJECT =
  "Your hyperbaric oxygen therapy aftercare";

export function hyperbaricPostEmail({
  firstName,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Your Hyperbaric Oxygen Therapy Aftercare",
    greeting(firstName) +
      paragraph(
        "Thank you for visiting Aspire Wellness today. Here is a short guide to help you get the most from your hyperbaric oxygen session.",
      ) +
      sectionHeading("What You Had Today") +
      paragraph(
        "A 60 minute session in our hyperbaric oxygen chamber. Breathing oxygen at increased atmospheric pressure allows more oxygen to dissolve into the blood plasma and reach tissues throughout the body. Every cell in your body relies on oxygen to produce energy. Hyperbaric therapy is increasingly being explored for its role in supporting recovery, cellular function and overall wellbeing.",
      ) +
      sectionHeading("What You May Notice (All Normal)") +
      bulletList([
        "A feeling of fullness or popping in the ears, similar to after a flight",
        "Feeling relaxed, calm or pleasantly tired",
        "A sense of mental clarity and renewed energy",
        "Occasionally, feeling slightly light headed for a short time",
      ]) +
      sectionHeading("Your Aftercare for the Rest of Today") +
      numberedList([
        {
          title: "Hydrate.",
          text: "Drink water through the rest of the day.",
        },
        {
          title: "Eat something light.",
          text: "A light meal or snack helps you feel settled.",
        },
        {
          title: "Clear your ears.",
          text: "If your ears still feel full, gently swallow, yawn or sip water.",
        },
        {
          title: "Take it easy.",
          text: "Give yourself a gentle rest of the day where you can.",
        },
      ]) +
      sectionHeading("Please Avoid") +
      bulletList([
        "Scuba diving for 24 hours after your session",
        "Strenuous exercise straight away if you feel light headed",
      ]) +
      sectionHeading("Before Your Next Session") +
      paragraph(
        "Please let us know before your next visit if you have a cold, blocked nose, sinus or ear problem, or any change in your health or medication. A blocked nose can make it harder to clear your ears in the chamber, so we may suggest rescheduling.",
      ) +
      sectionHeading("Make the Most of It") +
      paragraph(
        "Hyperbaric sessions are included in all of our memberships, from 2 sessions a month with Essentials to 8 sessions a month with Unlimited.",
      ) +
      bookNextSession() +
      signOff(),
  );
}
