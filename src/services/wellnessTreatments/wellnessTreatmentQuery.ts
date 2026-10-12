import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { Response, TTreatment } from "@/types/common";
import axios from "axios";

export async function getTreatments() {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.wellnessTreatment.getAll);

    const responseData: Response<TTreatment[]> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching wellness treatments: ", errorMessage);

      return { errorMessage };
    }
  }
}
