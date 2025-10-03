import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { TDenstistResponse, TDentist } from "@/types/dentist";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";

export async function getDentist() {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.dentist.getDentist);
    const responseData: Response<TDenstistResponse> = response.data;
    const dentist: TDentist = responseData.data.dentist;
    console.log(dentist.fileUrl);
    const upload = dentist.fileUrl ? await getAMedia(dentist.fileUrl) : null;

    dentist.file = upload;
    responseData.data.dentist = dentist;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching dentist: ", errorMessage);

      return { errorMessage };
    }
  }
}
