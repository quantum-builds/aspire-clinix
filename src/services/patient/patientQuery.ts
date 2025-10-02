import { ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TPatient } from "@/types/patient";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";
import { createServerAxios } from "@/lib/server-axios";

export async function getPatient() {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.patient.getPatient);
    const responseData: Response<TPatient> = response.data;
    const patient: TPatient = responseData.data;

    console.log(patient.fileUrl);
    const upload = patient.fileUrl
      ? await getAMedia(patient.fileUrl)
      : // : "/uploads/aspire-clinic/images/placeholder.png";
        null;

    patient.file = upload;
    // console.log("file is ", patient);
    responseData.data = patient;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching patient: ", errorMessage);

      return { errorMessage };
    }
  }
}
