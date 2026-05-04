import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";

export async function gettPractitionerById(practitionerId: string) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.practitioner.get(practitionerId),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.PRACTITIONER);
}

export async function getPractitioners() {
  const siteId = process.env.DENTALLY_SITE_ID;

  if (!siteId) {
    throw new Error("DENTALLY_SITE_ID is not defined in environment variables");
  }

  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.practitioner.list(siteId),
  );

  const practitionersResponse = dentallyErrorHelper(
    response.data,
    DATA_TYPE.PRACTITIONERS,
  );

  return practitionersResponse;
}

export async function patchPractitionerById(
  practitionerId: string,
  partialPractitioner: any,
) {
  const response = await axiosDentallyInstance.patch(
    DENTALLY_ENDPOINTS.practitioner.edit(practitionerId),
    partialPractitioner,
  );
  return dentallyErrorHelper(response, DATA_TYPE.PRACTITIONER);
}
