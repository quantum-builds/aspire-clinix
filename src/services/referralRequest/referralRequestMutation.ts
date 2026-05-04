import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TReferralRequest } from "@/types/referral-request";
import { ReferralRequestStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export const usePatchReferralRequest = () => {
  return useMutation({
    mutationFn: async ({
      referralRequest,
      id,
    }: {
      referralRequest: Partial<TReferralRequest>;
      id: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(id),
        referralRequest
      );
      return response.data;
    },
  });
};

export const useDeleteReferralRequests = () => {
  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
    }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.referralRequest.delete(id)
      );
      return response.data.data;
    },
  });
};

export const useBindAppointmentToReferral = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
      appointmentId,
      practitionerId,
    }: {
      referralRequestId: string;
      appointmentId: string;
      practitionerId: number;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(referralRequestId),
        { appointmentId, practitionerId, requestStatus: ReferralRequestStatus.ASSIGNED }
      );
      return response.data;
    },
  });
};

