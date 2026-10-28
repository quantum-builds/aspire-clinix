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

export const CONTRAST_CRYO_SAUNA_PRE_SUBJECT =
  "Preparing for your Contrast Session";

export function contrastCryoSaunaPreEmail({
  firstName,
  date,
  time,
}: WellnessBookingEmailData): string {
  return wellnessEmailLayout(
    "Preparing for Your Contrast Session",
    greeting(firstName) +
      paragraph(
        "Thank you for booking with Aspire Wellness. We look forward to welcoming you. Here is everything you need to know before your visit.",
      ) +
      bookingDetails({
        treatment: "Contrast Session, Cryotherapy followed by Infrared Sauna",
        date,
        time,
        allow:
          "around 90 minutes for your visit, including time to change, relax and shower afterwards.",
      }) +
      paragraph(
        "<em>Short on time? The cold and warm stages are the essential part, so simply let us know and we can keep the rest of your visit as brief as you like.</em>",
      ) +
      sectionHeading("What to Expect") +
      paragraph(
        "Contrast therapy pairs cold with warmth, and we always begin with the cold.",
      ) +
      paragraph(
        "After changing into one of our luxury robes, you will be taken to the cryotherapy room. Before stepping into the chamber, you will remove your robe and wear your swimwear, along with the protective gloves, socks and footwear we provide. You will then spend between three and five minutes in our whole body cryotherapy chamber, and your wellness guide will help you decide on the time, depending on the level of cold you would like.",
      ) +
      paragraph(
        "Once the cold stage is complete, you will be wrapped in a robe and taken straight to the pre heated Sunlighten&reg; Infrared Sauna. You will then enjoy a session of up to 45 minutes in this medical grade sauna, which combines red light with near, mid and far infrared. Our team will help you choose the setting that suits you best, and water is available throughout.",
      ) +
      paragraph(
        "Our team will be with you throughout, and you can end either stage at any time.",
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
          title: "Keep your skin product free.",
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
          title: "Eat lightly and hydrate well.",
          text: "A light meal an hour or two beforehand and plenty of water are ideal, especially before the sauna.",
        },
        {
          title: "Avoid alcohol",
          text: "on the day of your session.",
        },
      ]) +
      paragraph(
        "We provide towels, a robe and slippers, protective gloves, socks and footwear for the cryotherapy chamber, and shower facilities for afterwards.",
      ) +
      sectionHeading("Your Health Check") +
      paragraph(
        "Before your session, our team will ask a few questions about your health. Please let us know in advance if you are pregnant, have a heart or circulation condition, high or low blood pressure, Raynaud's or sensitivity to cold, or have recently been unwell. This helps us confirm the Contrast Session is right for you.",
      ) +
      changeBooking() +
      signOff(),
  );
}

export const CONTRAST_CRYO_SAUNA_POST_SUBJECT = "Your Contrast Session aftercare";

export function contrastCryoSaunaPostEmail({
  firstName,
}: WellnessBookingEmailData): string {
  return contrastPostEmail(
    firstName,
    "A Contrast Session: between three and five minutes in our whole body cryotherapy chamber, followed by a session in our medical grade Sunlighten&reg; Infrared Sauna.",
  );
}

/**
 * Post email shared by both Contrast Sessions; only the description of the
 * session differs.
 */
export function contrastPostEmail(
  firstName: string | undefined,
  sessionDescription: string,
): string {
  return wellnessEmailLayout(
    "Your Contrast Session Aftercare",
    greeting(firstName) +
      paragraph(
        "Thank you for visiting Aspire Wellness today. Here is a short guide to help you get the most from your Contrast Session.",
      ) +
      sectionHeading("What You Had Today") +
      paragraph(sessionDescription) +
      paragraph(
        "The cold activates the nervous system and leaves many guests feeling alert and clear headed, while the deep warmth that follows helps muscles relax and circulation increase. Moving from cold to warmth creates a powerful contrast that many guests find both invigorating and deeply relaxing.",
      ) +
      sectionHeading("What You May Notice (All Normal)") +
      bulletList([
        "Slightly pink or red skin, which usually fades as your body settles",
        "A tingling sensation in the skin",
        "Feeling warm, and continuing to sweat lightly, for a while afterwards",
        "A sense of alertness and a lift in energy",
        "Feeling relaxed and pleasantly tired",
      ]) +
      sectionHeading("Your Aftercare for the Rest of Today") +
      numberedList([
        {
          title: "Rehydrate.",
          text: "This is the most important step. Drink water steadily over the next few hours, ideally with electrolytes, to replace what you lost through sweating.",
        },
        {
          title: "Let your body settle.",
          text: "Allow your body to return to its normal temperature at its own pace.",
        },
        {
          title: "Rinse off.",
          text: "A lukewarm shower, and a moisturiser afterwards, keep skin comfortable.",
        },
        {
          title: "Eat well.",
          text: "A balanced meal helps replace natural salts and minerals.",
        },
        {
          title: "Wrap up.",
          text: "Dress warmly when you leave, particularly on colder days.",
        },
      ]) +
      sectionHeading("Please Avoid") +
      bulletList([
        "Alcohol for the rest of the day, as it adds to dehydration",
        "Intense exercise straight after your session",
        "A very hot bath or shower immediately afterwards",
      ]) +
      sectionHeading("Before Your Next Session") +
      paragraph(
        "If anything changes with your health or medication, please let us know before you book again, so we can confirm the Contrast Session is still right for you.",
      ) +
      sectionHeading("Make the Most of It") +
      paragraph(
        "Contrast Sessions are included in all of our memberships and count as two treatments. You can also vary your session each time, choosing cryotherapy or an ice bath for the cold, and the infrared sauna or the red light bed for the warmth.",
      ) +
      bookNextSession() +
      signOff(),
  );
}
