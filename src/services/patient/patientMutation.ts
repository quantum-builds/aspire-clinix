import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TPatient, TPatientCreate } from "@/types/patient";
import { useMutation } from "@tanstack/react-query";

export const useCreatePatient = () => {
  return useMutation({
    mutationFn: async ({ patientData }: { patientData: TPatientCreate }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.auth.register,
        patientData

      );
      const patient: TPatient = response.data.data;
      return patient;
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
        partialPatient,
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

type TFamilyMember = {
  id: string;
  dentallyId?: string;
  firstName?: string;
  lastName?: string;
  familyId?: string;
};

export const useGetFamilyMembers = () => {
  return useMutation({
    mutationFn: async ({ familyId }: { familyId: string }) => {
      const response = await axiosInstance.get(
        ENDPOINTS.patient.familyMember(familyId),
      );

      const responseData: Response<TFamilyMember[]> = response.data;
      return responseData.data;
    },
  });
};


