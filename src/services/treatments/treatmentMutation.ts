import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TTreatment, TTreatmentCreate, TTreatmentUpdate } from "@/types/treatment";
import { useMutation } from "@tanstack/react-query";

export const useCreateTreatment = () => {
  return useMutation({
    mutationFn: async ({ treatment }: { treatment: TTreatmentCreate }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.treatment.create,
        treatment
      );
      const createdTreatment: TTreatment = response.data.data;
      return createdTreatment;
    },
  });
};

export const usePatchTreatment = () => {
  return useMutation({
    mutationFn: async ({
      id,
      treatment,
    }: {
      id: string;
      treatment: TTreatmentUpdate;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.treatment.update(id),
        treatment
      );
      const updatedTreatment: TTreatment = response.data.data;
      return updatedTreatment;
    },
  });
};
