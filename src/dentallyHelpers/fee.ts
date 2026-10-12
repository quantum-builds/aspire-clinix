import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";

export type DentallyFee = {
  id?: string;
  treatmentId?: number;
  paymentPlanId?: number;
  priceOne?: string | number | null;
  durationOne?: string | number | null;
};

export async function getFeesByTreatment(treatmentId: number) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.fee.list(treatmentId),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.FEES);
}

export function pickValidPriceOne(
  fees: DentallyFee[] | null | undefined,
): string | null {
  if (!fees?.length) {
    return null;
  }

  for (const fee of fees) {
    const raw = fee?.priceOne;

    if (raw === null || raw === undefined) {
      continue;
    }

    const value = String(raw).trim();

    if (value === "") {
      continue;
    }

    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      return String(parsed);
    }
  }

  return null;
}

export function pickValidDurationOne(
  fees: DentallyFee[] | null | undefined,
): number | null {
  if (!fees?.length) {
    return null;
  }

  for (const fee of fees) {
    const raw = fee?.durationOne;

    if (raw === null || raw === undefined) {
      continue;
    }

    const parsed = Number(raw);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
}
