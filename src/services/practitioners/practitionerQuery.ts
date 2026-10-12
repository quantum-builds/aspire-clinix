import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { Response, TPractitioner } from "@/types/common";
import axios from "axios";

export async function getActivePractitioners() {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.practitioners.getAll);

    const responseData: Response<TPractitioner[]> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching practitioners: ", errorMessage);

      return { errorMessage };
    }
  }
}
