import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { useMutation } from "@tanstack/react-query";

interface CheckoutSessionData {
  treatmentId: number;
  practitionerId: string;
  startTime: string;
  finishTime: string;
  reason: string;
  patientId: string;
}

interface CheckoutSessionResponse {
  checkoutUrl: string;
}

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async (
      data: CheckoutSessionData,
    ): Promise<Response<CheckoutSessionResponse>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.checkout.createSession,
        data,
      );
      return response.data;
    },
  });
};
