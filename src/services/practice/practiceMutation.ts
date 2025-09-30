import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPractice, TPracticeCreate } from "@/types/practice";
import { useMutation } from "@tanstack/react-query";

export const useCreatePractice = () => {
  return useMutation({
    mutationFn: async ({
      practiceCreate,
    }: {
      practiceCreate: TPracticeCreate;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.practices.createPractice,
        practiceCreate
      );

      const practice: TPractice = response.data.data;
      return practice;
    },
  });
};
