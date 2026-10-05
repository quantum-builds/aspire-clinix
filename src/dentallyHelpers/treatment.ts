import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";
import {
  DentallyFee,
  getFeesByTreatment,
  pickValidDurationOne,
  pickValidPriceOne,
} from "./fee";

const REQUIRED_WELLNESS_TREATMENTS = new Map<number, string>([
  // [1367625, "Compression Therapy"],
  [1367621, "Cryotherapy"],
  [1367845, "Contrast Session (Cryo + Sauna)"],
  [1367626, "Ice Bath"],
  [1367623, "Hyperbaric Oxygen Chamber"],
  [1367624, "Red Light Therapy"],
  [1367622, "Infrared Sauna"],
]);

const TREATMENTS_PER_PAGE = 100;

type DentallyTreatment = {
  id: number;
  nomenclature?: string | null;
  patientNomenclature?: string | null;
  notes?: string | null;
  description?: string | null;
  code?: string | null;
};

export async function getWellnessTreatments() {
  const siteId = process.env.DENTALLY_SITE_ID;

  if (!siteId) {
    throw new Error("DENTALLY_SITE_ID is not defined in environment variables");
  }

  const matched: {
    id: number;
    name: string;
    description?: string | null;
    code?: string;
  }[] = [];

  const matchedIds = new Set<number>();

  let page = 1;
  let totalPages = 1;

  do {
    const response = await axiosDentallyInstance.get(
      DENTALLY_ENDPOINTS.treatment.list(siteId, page, TREATMENTS_PER_PAGE),
    );

    const treatmentsResponse = dentallyErrorHelper(
      response.data,
      DATA_TYPE.TREATMENTS,
    );

    if (treatmentsResponse.isError) {
      return treatmentsResponse;
    }

    const treatments = (treatmentsResponse.response.treatments ||
      []) as DentallyTreatment[];

    for (const treatment of treatments) {
      if (
        matchedIds.has(treatment.id) ||
        !REQUIRED_WELLNESS_TREATMENTS.has(treatment.id)
      ) {
        continue;
      }

      const configuredName = REQUIRED_WELLNESS_TREATMENTS.get(treatment.id)!;

      matchedIds.add(treatment.id);

      matched.push({
        id: treatment.id,
        name: configuredName,
        description: treatment.notes ?? treatment.description ?? null,
        code: treatment.code || undefined,
      });
    }

    if (matchedIds.size >= REQUIRED_WELLNESS_TREATMENTS.size) {
      break;
    }

    const meta = treatmentsResponse.response.meta;

    totalPages = meta?.totalPages ?? page;
    page += 1;
  } while (page <= totalPages);

  const treatmentsWithPrices = await Promise.all(
    matched.map(async (treatment) => {
      try {
        const feeResult = await getFeesByTreatment(treatment.id);

        if (feeResult.isError) {
          return {
            ...treatment,
            price: null,
            duration: null,
          };
        }

        const fees = (feeResult.response.fees || []) as DentallyFee[];

        return {
          ...treatment,
          price: pickValidPriceOne(fees),
          duration: pickValidDurationOne(fees),
        };
      } catch (error) {
        console.error(`Failed to get fee for treatment ${treatment.id}`, error);

        return {
          ...treatment,
          price: null,
          duration: null,
        };
      }
    }),
  );

  return {
    isError: false as const,
    response: {
      treatments: treatmentsWithPrices,
      meta: null,
    },
  };
}
