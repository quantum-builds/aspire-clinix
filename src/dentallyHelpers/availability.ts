import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";

export async function getAvailability({
  practitionerId,
  startTime,
  finishTime,
  duration,
  test = false,
}: {
  practitionerId: number;
  startTime: string;
  finishTime: string;
  duration?: number | null;
  test?: boolean
  
}) {

  if(test){
    console.log("Fetching availability with parameters:", {
    practitionerId,
    startTime,
    finishTime,
    duration,
    test,
  });
  }
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.availability.list(
      practitionerId,
      startTime,
      finishTime,
      duration ?? undefined,
      
    ),
  );
  console.log("Availability API response:", response.data);

  

   

  return dentallyErrorHelper(response.data, DATA_TYPE.AVAILABILITY);
}
