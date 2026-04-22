import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPatient, TPatientCreate } from "@/types/patient";
import { useMutation } from "@tanstack/react-query";

export const useCreatePatient = () => {
  return useMutation({
    mutationFn: async ({
      patientData,
    }: {
      patientData: TPatientCreate;
    }) => {
      // const response = await axiosInstance.patch(
      //   ENDPOINTS.patient.editPatient,
      //   patientData
      // );

      // const patient: TPatient = response.data.data;
      // return patient;
    },
  });
};


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


