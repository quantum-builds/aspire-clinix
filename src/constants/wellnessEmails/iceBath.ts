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

export const ICE_BATH_POST_SUBJECT = "Your ice bath aftercare";

export function iceBathPostEmail({
  firstName,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Your Ice Bath Aftercare",
    greeting(firstName) +
      paragraph(
        "Thank you for visiting Aspire Wellness today. Here is a short guide to help you get the most from your ice bath.",
      ) +
      sectionHeading("What You Had Today") +
      paragraph(
        "A three minute ice bath, the traditional form of cold immersion. Cold provides a brief physiological challenge that activates the nervous system, and many guests leave feeling alert, refreshed and mentally switched on.",
      ) +
      paragraph(
        "Cold is a challenge the body responds to, and many guests notice a lift in energy even after one session, with many finding regular use the most rewarding. Many guests also leave with a real sense of achievement.",
      ) +
      sectionHeading("What You May Notice (All Normal)") +
      bulletList([
        "Red or pink skin, which usually fades as you rewarm",
        "Tingling, or brief numbness in fingers and toes",
        "Shivering as your body warms back up",
        "A strong sense of alertness and energy",
      ]) +
      sectionHeading("Your Aftercare for the Rest of Today") +
      numberedList([
        {
          title: "Rewarm gradually.",
          text: "Dry off fully, put on warm layers, and use light movement such as a short walk.",
        },
        {
          title: "Have a warm drink.",
          text: "A warm, non alcoholic drink helps you settle.",
        },
        {
          title: "Hydrate.",
          text: "Drink water through the rest of the day.",
        },
        {
          title: "Shower warm, not hot.",
          text: "Give your body time to rewarm before a very hot shower or bath.",
        },
        {
          title: "Contrast Session.",
          text: "If you are having a Contrast Session, our team will wrap you in a robe after your ice bath and take you straight to the pre heated Sunlighten&reg; Infrared Sauna or the Red Light Therapy bed.",
        },
      ]) +
      sectionHeading("Please Avoid") +
      bulletList([
        "A very hot shower, bath or sauna immediately afterwards, unless it is part of a planned Contrast Session",
        "Alcohol straight after your session",
        "Staying in wet clothing or sitting still somewhere cold",
      ]) +
      sectionHeading("A Note for Anyone Training for Strength or Muscle") +
      paragraph(
        "Research continues to explore whether cold immersion straight after strength training may affect how muscles adapt. Many people leave several hours between strength training and an ice bath, and our team can help you plan the timing that suits your goals.",
      ) +
      sectionHeading("Before Your Next Session") +
      paragraph(
        "If anything changes with your health or medication, please let us know before you book again, so we can confirm the ice bath is still right for you.",
      ) +
      sectionHeading("Make the Most of It") +
      paragraph(
        "The ice bath can also be your cold choice in our Contrast Session, followed by the Sunlighten&reg; Infrared Sauna or the Red Light Therapy bed. Both are included in all of our memberships, which start from £275 per month.",
      ) +
      bookNextSession() +
      signOff(),
  );
}
