import {
  CRYOTHERAPY_POST_SUBJECT,
  CRYOTHERAPY_PRE_SUBJECT,
  cryotherapyPostEmail,
  cryotherapyPreEmail,
} from "./cryotherapy";
import {
  HYPERBARIC_POST_SUBJECT,
  HYPERBARIC_PRE_SUBJECT,
  hyperbaricPostEmail,
  hyperbaricPreEmail,
} from "./hyperbaric";
import {
  ICE_BATH_POST_SUBJECT,
  ICE_BATH_PRE_SUBJECT,
  iceBathPostEmail,
  iceBathPreEmail,
} from "./iceBath";
import {
  RED_LIGHT_POST_SUBJECT,
  RED_LIGHT_PRE_SUBJECT,
  redLightPostEmail,
  redLightPreEmail,
} from "./redLight";
import {
  INFRARED_SAUNA_POST_SUBJECT,
  INFRARED_SAUNA_PRE_SUBJECT,
  infraredSaunaPostEmail,
  infraredSaunaPreEmail,
} from "./infraredSauna";
import {
  BREATHWORK_POST_SUBJECT,
  BREATHWORK_PRE_SUBJECT,
  breathworkPostEmail,
  breathworkPreEmail,
} from "./breathwork";
import { isBreathworkTreatment } from "@/lib/treatment-session";
import {
  CONTRAST_ICE_BATH_SAUNA_POST_SUBJECT,
  CONTRAST_ICE_BATH_SAUNA_PRE_SUBJECT,
  contrastIceBathSaunaPostEmail,
  contrastIceBathSaunaPreEmail,
} from "./contrastIceBathSauna";
import {
  CONTRAST_CRYO_SAUNA_POST_SUBJECT,
  CONTRAST_CRYO_SAUNA_PRE_SUBJECT,
  contrastCryoSaunaPostEmail,
  contrastCryoSaunaPreEmail,
} from "./contrastCryoSauna";
import { COMPRESSION_POST_SUBJECT, compressionPostEmail } from "./compression";
import type { WellnessBookingEmail } from "./types";

export * from "./types";
export * from "./compression";
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
 * Email sent when a wellness appointment is marked Completed, keyed by
 * Dentally treatment ID. Add each treatment's post email here.
 */
export const WELLNESS_POST_EMAILS: Record<number, WellnessBookingEmail> = {
  [1367621]: { subject: CRYOTHERAPY_POST_SUBJECT, build: cryotherapyPostEmail }, // Whole Body Cryotherapy
  [1367623]: { subject: HYPERBARIC_POST_SUBJECT, build: hyperbaricPostEmail }, // Hyperbaric Oxygen Chamber
  [1367622]: {
    subject: INFRARED_SAUNA_POST_SUBJECT,
    build: infraredSaunaPostEmail,
  }, // Infrared Sauna
  [1367626]: { subject: ICE_BATH_POST_SUBJECT, build: iceBathPostEmail }, // Ice Bath
  [1367624]: { subject: RED_LIGHT_POST_SUBJECT, build: redLightPostEmail }, // Red Light Therapy
  [1367845]: {
    subject: CONTRAST_CRYO_SAUNA_POST_SUBJECT,
    build: contrastCryoSaunaPostEmail,
  }, // Contrast Session (Cryo + Sauna)
  [1526324]: {
    subject: CONTRAST_ICE_BATH_SAUNA_POST_SUBJECT,
    build: contrastIceBathSaunaPostEmail,
  }, // Contrast Session (Ice Bath + Sauna)
  [1367625]: {
    subject: COMPRESSION_POST_SUBJECT,
    build: compressionPostEmail,
  }, // Compression Therapy (not bookable yet; see dentallyHelpers/treatment.ts)
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

/** Post emails for admin-managed sessions, sent when marked Completed. */
export const SESSION_POST_EMAILS: {
  matches: (treatmentName: string) => boolean;
  email: WellnessBookingEmail;
}[] = [
  {
    matches: isBreathworkTreatment,
    email: { subject: BREATHWORK_POST_SUBJECT, build: breathworkPostEmail },
  },
];
