import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { TDentist } from "@/types/dentist";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";
import { TAdmin } from "@/types/admin";

export async function getAdmin() {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.admin.getAdmin);
    const responseData: Response<TAdmin> = response.data;
    const admin: TAdmin = responseData.data;

    const upload = admin.fileUrl ? await getAMedia(admin.fileUrl) : null;

    admin.file = upload;
    responseData.data = admin;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching admin: ", errorMessage);

      return { errorMessage };
    }
  }
}
