import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { Response } from "@/types/common";
import {
  TReferralRequest,
  TReferralRequestResponse,
} from "@/types/referral-request";
import axios from "axios";

export async function getReferralRequests({
  page,
  search,
  on,
  before,
  after,
  status,
}: {
  page?: number;
  search?: string;
  on?: string;
  before?: string;
  after?: string;
  status?: string;
}) {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(
      ENDPOINTS.referralRequest.get(page, search, on, before, after, status)
    );

    const responseData: Response<TReferralRequestResponse> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching appointments: ", errorMessage);

      return { errorMessage };
    }
  }
}

export async function getReferralRequest(id: string) {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(
      ENDPOINTS.referralRequest.getById(id)
    );

    const responseData: Response<TReferralRequest> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching referral: ", errorMessage);

      return { errorMessage };
    }
  }
}
