import { TPractitioner } from "@/types/common";
export const TREATMENT_PRACTITIONER_NAMES: Record<number, string> = {
  [1367621]: "Muhammad Massab", // Cryotherapy
  [1367845]: "Contrast Therapy", // Contrast Session (Cryo + Sauna)
  [1526324]: "Contrast Therapy", // Contrast Session (Ice bath + Sauna)
  [1367623]: "Hyperbaric Chamber", // Hyperbaric Oxygen Chamber
  [1367626]: "Ice Bath", // Ice Bath
  [1367624]: "red light", // Red Light Therapy
  [1367622]: "Infared Sauna", // Infrared Sauna
};

export function findPractitionerForTreatment(
  practitioners: TPractitioner[],
  treatmentId?: string | number,
): TPractitioner | null {
  if (!treatmentId) return null;

  const practitionerName = TREATMENT_PRACTITIONER_NAMES[Number(treatmentId)];

  if (!practitionerName) return null;

  const normalized = practitionerName.toLowerCase();

  return (
    practitioners.find((practitioner) =>
      `${practitioner.firstName} ${practitioner.lastName}`
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .includes(normalized),
    ) ?? null
  );
}