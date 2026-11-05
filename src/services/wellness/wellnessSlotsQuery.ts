import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { SlotChip } from "@/utils/slotSelectionUtils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface WellnessSlotsResponse {
  treatmentId: number;
  duration: number;
  days: { date: string; slots: SlotChip[] }[];
}

export const useGetWellnessSlots = ({
  treatmentId,
  date,
}: {
  treatmentId?: string;
  date: string;
}) => {
  return useQuery({
    queryKey: ["wellnessSlots", treatmentId, date],
    queryFn: async (): Promise<Response<WellnessSlotsResponse | null>> => {
      try {
        const params = new URLSearchParams({ treatmentId: treatmentId ?? "", date });
        const response = await axiosInstance.get(
          `${ENDPOINTS.wellnessAppointments.slots}?${params.toString()}`,
        );
        return response.data;
      } catch (error) {
        // Show the API's message (e.g. "not available for online booking").
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as Response<null>;
        }

        return {
          status: false,
          message: error instanceof Error ? error.message : String(error),
          data: null,
        };
      }
    },
    enabled: Boolean(treatmentId),
    staleTime: 60 * 1000,
  });
};
