import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TCreateReferralForm, TReferralForm } from "@/types/referral-form";
import { useMutation } from "@tanstack/react-query";

export const useCreateReferralForm = () => {
  return useMutation({
    mutationFn: async ({
      referralForm,
    }: {
      referralForm: TCreateReferralForm;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.referralForm.create,
        referralForm
      );
      const data:TReferralForm=response.data.data
      return data;
    },
  });
};
