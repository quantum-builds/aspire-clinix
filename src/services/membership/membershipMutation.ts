import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { useMutation } from "@tanstack/react-query";

interface BuyPlanData {
  planId: string;
}

interface UpgradePlanData {
  newPlanId: string;
}

interface BuyPlanResponse {
  checkoutUrl: string;
}

interface UpgradePlanResponse {
  pendingPlanId: string;
  effectiveDate: Date;
}

interface BookAppointmentData {
  treatmentId: number;
  practitionerId: string;
  startTime: string;
  finishTime: string;
  reason: string;
  patientId: string;
}

interface BookAppointmentResponse {
  appointmentId: string;
}

export const useBuyPlan = () => {
  return useMutation({
    mutationFn: async (
      data: BuyPlanData,
    ): Promise<Response<BuyPlanResponse>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.membership.checkout,
        data,
      );
      return response.data;
    },
  });
};

export const useUpgradePlan = () => {
  return useMutation({
    mutationFn: async (
      data: UpgradePlanData,
    ): Promise<Response<UpgradePlanResponse>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.membership.upgrade,
        data,
      );
      return response.data;
    },
  });
};

export const useCancelUpgrade = () => {
  return useMutation({
    mutationFn: async (): Promise<Response<null>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.membership.cancelUpgrade,
      );
      return response.data;
    },
  });
};

export const useCancelMembership = () => {
  return useMutation({
    mutationFn: async (): Promise<Response<null>> => {
      const response = await axiosInstance.post(ENDPOINTS.membership.cancel);
      return response.data;
    },
  });
};

export const useReactivateMembership = () => {
  return useMutation({
    mutationFn: async (): Promise<Response<null>> => {
      const response = await axiosInstance.post(ENDPOINTS.membership.reactivate);
      return response.data;
    },
  });
};

export const useBookMembershipAppointment = () => {
  return useMutation({
    mutationFn: async (
      data: BookAppointmentData,
    ): Promise<Response<BookAppointmentResponse>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.membership.bookAppointment,
        data,
      );
      return response.data;
    },
  });
};
