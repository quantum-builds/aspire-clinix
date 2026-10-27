import { CRYOTHERAPY_PRE_SUBJECT, cryotherapyPreEmail } from "./cryotherapy";
import { HYPERBARIC_PRE_SUBJECT, hyperbaricPreEmail } from "./hyperbaric";
import { ICE_BATH_PRE_SUBJECT, iceBathPreEmail } from "./iceBath";
import { RED_LIGHT_PRE_SUBJECT, redLightPreEmail } from "./redLight";
import {
  INFRARED_SAUNA_PRE_SUBJECT,
  infraredSaunaPreEmail,
} from "./infraredSauna";
import { BREATHWORK_PRE_SUBJECT, breathworkPreEmail } from "./breathwork";
import { isBreathworkTreatment } from "@/lib/treatment-session";
import {
  CONTRAST_ICE_BATH_SAUNA_PRE_SUBJECT,
  contrastIceBathSaunaPreEmail,
} from "./contrastIceBathSauna";
import {
  CONTRAST_CRYO_SAUNA_PRE_SUBJECT,
  contrastCryoSaunaPreEmail,
} from "./contrastCryoSauna";
import type { WellnessBookingEmail } from "./types";

export * from "./types";
export * from "./contrastCryoSauna";
export * from "./contrastIceBathSauna";
export * from "./breathwork";
export * from "./infraredSauna";
export * from "./cryotherapy";
export * from "./hyperbaric";
export * from "./iceBath";
export * from "./redLight";


export const WELLNESS_BOOKING_EMAILS: Record<number, WellnessBookingEmail> = {
  [1367621]: { subject: CRYOTHERAPY_PRE_SUBJECT, build: cryotherapyPreEmail }, // Whole Body Cryotherapy
  [1367623]: { subject: HYPERBARIC_PRE_SUBJECT, build: hyperbaricPreEmail }, // Hyperbaric Oxygen Chamber
  [1367626]: { subject: ICE_BATH_PRE_SUBJECT, build: iceBathPreEmail }, // Ice Bath
  [1367624]: { subject: RED_LIGHT_PRE_SUBJECT, build: redLightPreEmail }, // Red Light Therapy
  [1367622]: { subject: INFRARED_SAUNA_PRE_SUBJECT, build: infraredSaunaPreEmail }, // Infrared Sauna
  [1526324]: {
    subject: CONTRAST_ICE_BATH_SAUNA_PRE_SUBJECT,
    build: contrastIceBathSaunaPreEmail,
  }, // Contrast Session (Ice Bath + Sauna)
  [1367845]: {
    subject: CONTRAST_CRYO_SAUNA_PRE_SUBJECT,
    build: contrastCryoSaunaPreEmail,
  }, // Contrast Session (Cryo + Sauna)
};

/**
 * Emails for admin-managed session treatments (booked as a Session, not a
 * Dentally appointment). These treatments have cuid IDs, so match on name.
 */
export const SESSION_BOOKING_EMAILS: {
  matches: (treatmentName: string) => boolean;
  email: WellnessBookingEmail;
}[] = [
  {
    matches: isBreathworkTreatment,
    email: { subject: BREATHWORK_PRE_SUBJECT, build: breathworkPreEmail },
  },
];
