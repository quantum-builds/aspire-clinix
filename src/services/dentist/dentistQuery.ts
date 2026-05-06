import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { TDenstistResponse, TDentist } from "@/types/dentist";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";

export async function getDentist() {
  try {
    console.log("getDentist: calling endpoint", ENDPOINTS.dentist.getDentist);
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.dentist.getDentist);
    console.log(
      "getDentist: raw serverAxios response",
      response && response.data,
    );
    const responseData: Response<TDenstistResponse> = response.data;
    console.log("getDentist: parsed responseData", responseData);
    const dentist: TDentist | null = responseData?.data?.dentist ?? null;
    if (!dentist) return responseData;
    const upload = dentist.fileUrl ? await getAMedia(dentist.fileUrl) : null;

    dentist.file = upload;
    responseData.data.dentist = dentist;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "getDentist: axios error",
        error.response?.status,
        error.response?.data,
      );
      return error.response?.data ?? { errorMessage: "Unknown axios error" };
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("getDentist: non-axios error", errorMessage);
    return { errorMessage };
  }
}
