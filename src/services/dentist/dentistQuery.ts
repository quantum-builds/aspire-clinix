import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { TDenstistResponse, TDentist } from "@/types/dentist";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";
import { createResponse } from "@/utils/createResponse";

export async function getDentist(): Promise<
  Response<TDenstistResponse | null>
> {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.dentist.getDentist, {
      validateStatus: () => true,
    });

    const responseData = response.data as Response<TDenstistResponse | null>;

    if (!responseData?.status) return responseData;

    if (!responseData.data) {
      return createResponse(false, "Malformed response from server.", null);
    }

    const dentist: TDentist | null = responseData.data.dentist ?? null;
    if (!dentist) return responseData;

    const upload = dentist.fileUrl ? await getAMedia(dentist.fileUrl) : null;
    dentist.file = upload?.files?.[0] ?? null;
    responseData.data.dentist = dentist;

    // keep responseData.data as TDenstistResponse and update its dentist property
    return {
      ...responseData,
      data: {
        ...responseData.data,
        dentist,
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "getDentist: axios error",
        error.response?.status,
        error.response?.data,
      );

      const responseData = error.response?.data as
        | Response<TDenstistResponse | null>
        | undefined;

      if (
        responseData &&
        typeof responseData === "object" &&
        "status" in responseData &&
        "message" in responseData &&
        "data" in responseData
      ) {
        return responseData;
      }

      return createResponse(false, error.message, null);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("getDentist: non-axios error", errorMessage);
    return createResponse(false, errorMessage, null);
  }
}
