import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import axios from "axios";

export async function getStripeStatus(sessionId: string) {
  try {
    const response = await axiosInstance.get(ENDPOINTS.stripe.status, {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in checking payment status: ", errorMessage);

      return { errorMessage };
    }
  }
}
