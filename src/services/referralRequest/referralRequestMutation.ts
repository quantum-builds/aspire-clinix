import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TReferralRequest } from "@/types/referral-request";
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

export const useAppointmentBindingMutation = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
      appointmentId,
      practitionerId,
      requestStatus,
    }: {
      referralRequestId: string;
      appointmentId: string;
      practitionerId?: number;
      requestStatus: "ASSIGNED" | "UNASSIGNED";
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(referralRequestId),
        { appointmentId, practitionerId, requestStatus, actionType: "APPOINTMENT_BIND" }
      );
      return response.data;
    },
  });
};

export const useAssignDentistMutation = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
      practitionerId,
    }: {
      referralRequestId: string;
      practitionerId: number;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(referralRequestId),
        {
          requestStatus: "PENDING_REVIEW",
          practitionerId,
          actionType: "DENTIST_ASSIGN",
        }
      );
      return response.data;
    },
  });
};

export const useUnassignDentistMutation = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
    }: {
      referralRequestId: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(referralRequestId),
        {
          requestStatus: "UNASSIGNED",
        }
      );
      return response.data;
    },
  });
};

export const useRespondToReferralMutation = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
      action,
      comments,
      proposedTreatmentDetails,
      proposedConsultationTime,
    }: {
      referralRequestId: string;
      action: "ACCEPTED" | "REJECTED";
      comments?: string;
      proposedTreatmentDetails?: string;
      proposedConsultationTime?: string;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.referralRequest.respond(referralRequestId),
        {
          action,
          comments,
          proposedTreatmentDetails,
          proposedConsultationTime,
        }
      );
      return response.data;
    },
  });
};

