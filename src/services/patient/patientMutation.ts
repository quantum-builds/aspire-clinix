import { axiosInstance, axiosDentallyInstance, ENDPOINTS, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TPatient, TPatientCreate } from "@/types/patient";
import { useMutation, useQuery } from "@tanstack/react-query";

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
  imageUrl?: string;
};

export const getfamilyfembers = (familyId: string) => {
  return useQuery({
    queryKey: ["family-members", familyId],
    queryFn: async () => {
      console.log("useGetFamilyMembers query called with familyId:", familyId);
      const response = await axiosInstance.get(
        ENDPOINTS.patient.familyMember(familyId),
      );
      console.log("coming from our api:", JSON.stringify(response?.data?.data, null, 2));

      const responseData: Response<TFamilyMember[]> = response.data;
      return responseData.data;
    },
    enabled: !!familyId,
  });
};



export const useSwitchFamilyMember = () => {
  return useMutation({
    mutationFn: async ({ targetDentallyId }: { targetDentallyId: string }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.patient.switchFamilyMember,
        { targetDentallyId },
      );
      return response.data;
    },
  });
};

export const getPatientById = async (patientId: string) => {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.patient.get(patientId)
  );
  const responseData: Response<TPatient> = response.data;
  return responseData.data;
}






 
