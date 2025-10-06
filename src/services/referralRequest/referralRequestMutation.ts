import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TReferralRequest } from "@/types/referral-request";
import { useMutation } from "@tanstack/react-query";

export const usePatchReferralRequest = () => {
  return useMutation({
    mutationFn: async ({
      referralRequest,
      id,
    }: {
      referralRequest: Partial<TReferralRequest>;
      id: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(id),
        referralRequest
      );
      return response.data;
    },
  });
};