import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TDentistPractice } from "@/types/dentistRequest";
import axios from "axios";

export async function getDentistPractice({
  dentistId,
  practiceId,
}: {
  dentistId?: string;
  practiceId?: string;
}) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.dentistToPractice.get(dentistId, practiceId)
    );

    const responseData: Response<TDentistPractice[]> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching data: ", errorMessage);

      return { errorMessage };
    }
  }
}
