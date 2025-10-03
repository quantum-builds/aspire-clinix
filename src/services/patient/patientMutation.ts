import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPatient, TPatientCreate } from "@/types/patient";
import { useMutation } from "@tanstack/react-query";

export const usePatchPatient = () => {
  return useMutation({
    mutationFn: async ({
      partialPatient,
    }: {
      partialPatient: Partial<TPatientCreate>;
    }) => {
      console.log("patient patient is ", partialPatient);
      const response = await axiosInstance.patch(
        ENDPOINTS.patient.editPatient,
        partialPatient
      );

      const patient: TPatient = response.data.data;
      return patient;
    },
  });
};

export const useCreatePatient = () => {
  return useMutation({
    mutationFn: async ({
      patientCreate,
    }: {
      patientCreate: TPatientCreate;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.patient.createPatient,
        patientCreate
      );

      const patient: TPatient = response.data.data;
      return patient;
    },
  });
};
