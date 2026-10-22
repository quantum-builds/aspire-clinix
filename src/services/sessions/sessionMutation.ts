import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { useMutation } from "@tanstack/react-query";

export type SessionBookingOutcome =
  | "BOOKED"
  | "CHECKOUT"
  | "PLAN_LIMIT_REACHED"
  | "BREATHWORK_LIMIT_REACHED";

export interface BookSessionData {
  treatmentId: string;
  date: string;
  startTime: string;
  payWithStripe?: boolean;
}

export interface BookSessionResponse {
  status: SessionBookingOutcome;
  session?: { id: string; startTime: string; endTime: string };
  remainingTreatments?: number | null;
  remainingBreathwork?: number;
  checkoutUrl?: string;
  sessionId?: string;
}

export const useBookSession = () => {
  return useMutation({
    mutationFn: async (
      data: BookSessionData,
    ): Promise<Response<BookSessionResponse>> => {
      const response = await axiosInstance.post(
        ENDPOINTS.sessions.create,
        data,
      );
      return response.data;
    },
  });
};
