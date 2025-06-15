import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TService } from "@/types/services";
import axios from "axios";

export async function fetchServices() {
  try {
    const response = await axiosInstance.get(ENDPOINTS.services.getService);
    const responseData: Response<TService[]> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error in fetching services:", error.response.data);
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching services:", errorMessage);
      return { errorMessage };
    }
  }
}

export async function fetchService(id: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.services.getAService(id)
    );
    const responseData: Response<TService> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error in fetching service:", error.response.data);
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching service:", errorMessage);
      return { errorMessage };
    }
  }
}
