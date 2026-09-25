import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";

export async function getAvailability({
  practitionerId,
  startTime,
  finishTime,
  duration,
}: {
  practitionerId: number;
  startTime: string;
  finishTime: string;
  duration?: number | null;
}) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.availability.list(
      practitionerId,
      startTime,
      finishTime,
      duration ?? undefined,
    ),
  );

  return dentallyErrorHelper(response.data, DATA_TYPE.AVAILABILITY);
}
