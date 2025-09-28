import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointmentResponse } from "@/types/appointment";
import { AppointmentDateType, Response } from "@/types/common";
import axios from "axios";

export async function getAppointments({
  page,
  search,
  patientId,
  dentistId,
  on,
  before,
  after,
  dateType,
  status,
}: {
  page?: number;
  search?: string;
  patientId?: string;
  dentistId?: string;
  on?: string;
  before?: string;
  after?: string;
  dateType?: AppointmentDateType | null;
  status?: string;
}) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.appointemt.get(
        page,
        search,
        patientId,
        dentistId,
        on,
        before,
        after,
        dateType,
        status
      )
    );

    const responseData: Response<TAppointmentResponse> = response.data;
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
