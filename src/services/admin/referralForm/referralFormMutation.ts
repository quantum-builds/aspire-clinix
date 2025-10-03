import { useMutation } from "@tanstack/react-query";

export const useCreateReferralForm = () => {
  return useMutation({
    mutationFn: async ({ form }: { form: CreateReferralForm }) => {
      const response: Response<null> = await axiosInstance.post(
        ENDPOINTS.referralForm.create,
        form
      );
      return response;
    },
  });
};
