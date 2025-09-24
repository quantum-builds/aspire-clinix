import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointmentRequestResponse } from "@/types/appointment-request";
import { Response } from "@/types/common";
import axios from "axios";

export async function getAppointmentRequests({
  page,
  search,
  patientId,
  on,
  before,
  after,
}: {
  page?: number;
  search?: string;
  patientId?: string;
  on?: string;
  before?: string;
  after?: string;
}) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.appointemtRequest.get(
        page,
        search,
        patientId,
        on,
        before,
        after
      )
    );

    const responseData: Response<TAppointmentRequestResponse> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching appointment requests: ", errorMessage);

      return { errorMessage };
    }
  }
}
