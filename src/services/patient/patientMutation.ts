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

type VerifyPatientPayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
};

export const useVerifyPatient = () => {
  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
    }: VerifyPatientPayload) => {
      const response = await axiosInstance.post(
        ENDPOINTS.patient.Verification,
        {
          firstName,
          lastName,
          dateOfBirth,
          phoneNumber,
          email,
        },
      );

      return response.data.data;
    },
  });
};
