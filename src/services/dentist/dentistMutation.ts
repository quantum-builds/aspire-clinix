import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TDentist, TDentistCreate } from "@/types/dentist";
import { useMutation } from "@tanstack/react-query";

export const useCreateDentist = () => {
  return useMutation({
    mutationFn: async ({
      dentistCreate,
    }: {
      dentistCreate: TDentistCreate;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.dentist.createDentist,
        dentistCreate
      );

      const dentist: TDentist = response.data.data;
      return dentist;
    },
  });
};
