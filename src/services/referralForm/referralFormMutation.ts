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
      console.log("Submitting referral form:", referralForm);
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      console.log("Endpoint:", ENDPOINTS.referralForm.create);

      try {
        const response = await axiosInstance.post(
          ENDPOINTS.referralForm.create,
          referralForm,
        );
        console.log("Response:", response);
        const data: TReferralForm = response.data.data;
        return data;
      } catch (error) {
        console.error("Mutation error details:", {
          message: error instanceof Error ? error.message : String(error),
          error: error,
        });
        throw error;
      }
    },
  });
};
