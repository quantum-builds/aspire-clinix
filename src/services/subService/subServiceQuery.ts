import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TService } from "@/types/services";
import { TSubService } from "@/types/subService";
import axios from "axios";

export async function fetchSubServices(serviceId: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.subServices.getSubServiceByServiceId(serviceId)
    );
    const responseData: Response<TSubService[]> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Axios error in fetching sub service:",
        error.response.data
      );
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching sub service:", errorMessage);
      return { errorMessage };
    }
  }
}

export async function fetchSubService(id: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.subServices.getASubService(id)
    );
    const responseData: Response<TSubService> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Axios error in fetching sub service:",
        error.response.data
      );
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching sub service:", errorMessage);
      return { errorMessage };
    }
  }
}
