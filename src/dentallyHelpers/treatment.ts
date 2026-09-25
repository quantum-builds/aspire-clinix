import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";
import { DentallyFee, getFeesByTreatment, pickValidDurationOne, pickValidPriceOne } from "./fee";

const REQUIRED_WELLNESS_TREATMENTS = new Set([
  "compression therapy",
  "cryotherapy",
  "contrast session (cryo + sauna)",
  "hyperbaric oxygen chamber",
  "ice bath",
  "red light therapy",
  "infrared sauna",
]);

const TREATMENTS_PER_PAGE = 100;

type DentallyTreatment = {
  id: number;
  nomenclature?: string | null;
  patientNomenclature?: string | null;
  description?: string | null;
  code?: string | null;
};


export async function getWellnessTreatments() {
  const siteId = process.env.DENTALLY_SITE_ID;

  if (!siteId) {
    throw new Error("DENTALLY_SITE_ID is not defined in environment variables");
  }

  const matched: { id: number; name: string; description?: string | null; code?: string }[] = [];
  const matchedNames = new Set<string>();

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
      const name = (
        treatment.patientNomenclature || treatment.nomenclature || ""
      ).trim();

      if (
        !name ||
        matchedNames.has(name) ||
        !REQUIRED_WELLNESS_TREATMENTS.has(name.toLowerCase())
      ) {
        continue;
      }

      matchedNames.add(name);
      matched.push({
        id: treatment.id,
        name,
        description: treatment.description || null,
        code: treatment.code || undefined,
      });
    }
    if (matchedNames.size >= REQUIRED_WELLNESS_TREATMENTS.size) {
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
          return { ...treatment, price: null };
        }

        const fees = (feeResult.response.fees || []) as DentallyFee[];
        return {
          ...treatment,
          price: pickValidPriceOne(fees),
          duration: pickValidDurationOne(fees),
        };
      } catch {
        return { ...treatment, price: null };
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
