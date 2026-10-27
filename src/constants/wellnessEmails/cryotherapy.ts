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

export const CRYOTHERAPY_PRE_SUBJECT = "Preparing for your cryotherapy session";

export function cryotherapyPreEmail({
  firstName,
  date,
  time,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Preparing for Your Cryotherapy Session",
    greeting(firstName) +
      paragraph(
        "Thank you for booking with Aspire Wellness. We look forward to welcoming you. Here is everything you need to know before your visit.",
      ) +
      bookingDetails({
        treatment: "Whole Body Cryotherapy",
        date,
        time,
        allow:
          "around 40 minutes for your visit, including time to change and relax afterwards.",
      }) +
      paragraph(
        "<em>Short on time? Your cryotherapy session of three to five minutes is the essential part, so simply let us know and we can keep the rest of your visit as brief as you like.</em>",
      ) +
      sectionHeading("What to Expect") +
      paragraph(
        "After changing into one of our luxury robes, you will be taken to the cryotherapy room. Before stepping into the chamber, you will remove your robe and wear your swimwear, along with the protective gloves, socks and footwear we provide. You will then spend between three and five minutes in our whole body cryotherapy chamber, and your wellness guide will help you decide on the time, depending on the level of cold you would like. Our team will be with you throughout, and you can end the session at any time.",
      ) +
      sectionHeading("How to Prepare") +
      numberedList([
        {
          title: "Arrive 10 minutes early.",
          text: "This gives you time to settle in and complete a short health check.",
        },
        {
          title: "Bring swimwear.",
          text: "You will need swimwear for the cryotherapy chamber.",
        },
        {
          title: "Bring warm clothing.",
          text: "On colder days, please bring warm layers to travel home in.",
        },
        {
          title: "Keep your skin dry.",
          text: "Please avoid applying lotions, oils or creams on the day of your session.",
        },
        {
          title: "Keep your hair product free.",
          text: "Please avoid hair oils and creams on the day of your session.",
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
        "We provide a robe, slippers, and protective gloves, socks and footwear for the chamber.",
      ) +
      sectionHeading("Your Health Check") +
      paragraph(
        "Before your session, our team will ask a few questions about your health. Please let us know in advance if you are pregnant, have a heart or circulation condition, high blood pressure, Raynaud's or sensitivity to cold, or have recently been unwell. This helps us confirm cryotherapy is right for you.",
      ) +
      changeBooking() +
      signOff(),
  );
}
