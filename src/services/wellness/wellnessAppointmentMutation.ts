import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { useMutation } from "@tanstack/react-query";

export type EligibilityStatus =
  | "OK"
  | "PLAN_LIMIT_REACHED"
  | "HYPERBARIC_LIMIT_REACHED"
  | "NO_ACTIVE_PLAN";

export type BookingOutcome = EligibilityStatus | "SLOT_TAKEN";

export interface CheckEligibilityData {
  treatmentId: number;
}

export interface CheckEligibilityResponse {
  status: EligibilityStatus;
}

export interface BookWithPlanData {
  treatmentId: number;
  practitionerId: string;
  startTime: string;
  finishTime: string;
  reason: string;
  patientId: string;
}

export interface BookWithPlanResponse {
  status: BookingOutcome;
  appointmentId?: string;
  remainingTreatments?: number | null;
  remainingHyperbaric?: number | null;
}

export const useCheckEligibility = () => {
  return useMutation({
    mutationFn: async (
      data: CheckEligibilityData,
    ): Promise<Response<CheckEligibilityResponse>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.wellnessAppointments.checkEligibility,
        data,
      );
      return response.data;
    },
  });
};

export const useBookWithPlan = () => {
  return useMutation({
    mutationFn: async (
      data: BookWithPlanData,
    ): Promise<Response<BookWithPlanResponse>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.wellnessAppointments.bookWithPlan,
        data,
      );
      return response.data;
    },
  });
};