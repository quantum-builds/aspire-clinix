import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TPatient, TPatientCreate } from "@/types/patient";
import { useMutation } from "@tanstack/react-query";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async ({ patientData }: { patientData: TPatientCreate }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.auth.register,
        patientData
      );
      const respons = response.data.data;
      return respons;
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
  mobilePhone: string;
  email: string;
};

export const useVerifyPatient = () => {
  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      dateOfBirth,
      mobilePhone,
      email,
    }: VerifyPatientPayload) => {
      const response = await axiosInstance.post(
        ENDPOINTS.patient.Verification,
        {
          firstName,
          lastName,
          dateOfBirth,
          mobilePhone,
          email,
        },
      );
      return response.data?.data;
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


