import prisma from "@/lib/db";
import { getPractitioners } from "@/dentallyHelpers/practitioners";
import { getTreatmentById } from "@/dentallyHelpers/treatment";
import {
  DentallyFee,
  getFeesByTreatment,
  pickValidDurationOne,
} from "@/dentallyHelpers/fee";
import { findPractitionerForTreatment } from "@/lib/wellness-practitioners";
import { parseTreatmentTimes } from "@/lib/treatment-times";
import { TPractitioner } from "@/types/common";

export type WellnessTreatmentErrorCode =
  | "INVALID_TREATMENT"
  | "TREATMENT_NOT_AVAILABLE"
  | "NO_PRACTITIONER"
  | "NO_DURATION";

export class WellnessTreatmentError extends Error {
  constructor(
    public code: WellnessTreatmentErrorCode,
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

type DentallyPractitioner = {
  id: number;
  active?: boolean;
  user?: { firstName?: string | null; lastName?: string | null } | null;
};

type DentallyTreatment = {
  notes?: string | null;
  description?: string | null;
};

/**
 * Everything a Dentally wellness booking needs, worked out on the server so
 * the browser cannot choose the practitioner or the length:
 * - the treatment must be one we sell (has a TreatmentStripe row),
 * - the practitioner comes from TREATMENT_PRACTITIONER_NAMES,
 * - the duration is the "Total experience time" in the treatment notes,
 *   falling back to the Dentally fee duration.
 */
export async function resolveWellnessTreatment(treatmentIdRaw: unknown) {
  const treatmentId = Number(treatmentIdRaw);

  if (
    treatmentIdRaw === null ||
    treatmentIdRaw === undefined ||
    treatmentIdRaw === "" ||
    !Number.isInteger(treatmentId) ||
    treatmentId <= 0
  ) {
    throw new WellnessTreatmentError(
      "INVALID_TREATMENT",
      "Invalid treatment id.",
      400,
    );
  }

  const mapping = await prisma.treatmentStripe.findUnique({
    where: { treatmentId },
  });

  if (!mapping) {
    throw new WellnessTreatmentError(
      "TREATMENT_NOT_AVAILABLE",
      "This treatment is not available for online booking.",
      404,
    );
  }

  const [practitionersResult, treatmentResult] = await Promise.all([
    getPractitioners(),
    // Only needed for the duration, which can fall back to the fee.
    getTreatmentById(treatmentId).catch(() => null),
  ]);

  const practitioners: TPractitioner[] = practitionersResult.isError
    ? []
    : ((practitionersResult.response.practitioners ||
        []) as DentallyPractitioner[])
        .filter((practitioner) => practitioner.active === true)
        .map((practitioner) => ({
          id: practitioner.id,
          firstName: practitioner.user?.firstName || "",
          lastName: practitioner.user?.lastName || "",
        }));

  const practitioner = findPractitionerForTreatment(practitioners, treatmentId);

  if (!practitioner) {
    throw new WellnessTreatmentError(
      "NO_PRACTITIONER",
      "No practitioner is currently assigned to this treatment.",
      404,
    );
  }

  const treatment =
    !treatmentResult || treatmentResult.isError
      ? null
      : (treatmentResult.response.treatment as DentallyTreatment | null);

  let duration = parseTreatmentTimes(
    treatment?.notes ?? treatment?.description,
  ).totalTime;

  if (!duration) {
    const feeResult = await getFeesByTreatment(treatmentId);

    duration = feeResult.isError
      ? null
      : pickValidDurationOne(
          (feeResult.response.fees || []) as DentallyFee[],
        );
  }

  if (!duration) {
    throw new WellnessTreatmentError(
      "NO_DURATION",
      "Treatment duration is not set.",
      422,
    );
  }

  return {
    treatmentId,
    practitionerId: Number(practitioner.id),
    duration,
  };
}
