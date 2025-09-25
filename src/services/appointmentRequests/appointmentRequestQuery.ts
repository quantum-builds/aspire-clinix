import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import {
  TAppointmentRequest,
  TAppointmentRequestResponse,
} from "@/types/appointment-request";
import { Response } from "@/types/common";
import axios from "axios";
import { getAMedia } from "../s3/s3Query";

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
    const appointmentRequests: TAppointmentRequest[] =
      responseData.data.appointmentRequests;

    const uploads = await Promise.all(
      appointmentRequests.map(async (appointemtRequest) => {
        if (appointemtRequest.fileUrl) {
          const imageResponse = await getAMedia(appointemtRequest.fileUrl);
          return imageResponse;
        }
      })
    );

    appointmentRequests.forEach((appointemtRequest, index) => {
      appointemtRequest.file = uploads[index];
    });

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

export async function getAppointmentRequest( id: string ) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.appointemtRequest.getById(id)
    );

    const responseData: Response<TAppointmentRequest> = response.data;
    const appointmentRequest: TAppointmentRequest = responseData.data;

    const upload = appointmentRequest.fileUrl
      ? await getAMedia(appointmentRequest.fileUrl)
      : null;

    appointmentRequest.file = upload;
    responseData.data = appointmentRequest;
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
