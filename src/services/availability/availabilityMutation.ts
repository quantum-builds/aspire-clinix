import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response, TAvailabilitySlot } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAvailability = ({
  practitionerId,
  startTime,
  finishTime,
  duration,
}: {
  practitionerId?: string;
  startTime: string;
  finishTime: string;
  duration?: number | null;
}) => {
  return useQuery({
    queryKey: [
      "availability",
      practitionerId,
      startTime,
      finishTime,
      duration ?? null,
    ],
    queryFn: async (): Promise<Response<TAvailabilitySlot[]>> => {
      try {
        const params = new URLSearchParams({
          practitionerId: practitionerId ?? "",
          startTime,
          finishTime,
        });

        if (duration) {
          params.set("duration", String(duration));
        }

        const response = await axiosInstance.get(
          `${ENDPOINTS.availability.getAll}?${params.toString()}`,
        );

        return response.data as Response<TAvailabilitySlot[]>;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as Response<TAvailabilitySlot[]>;
        }

        const errorMessage =
          error instanceof Error ? error.message : String(error);

        return { status: false, message: errorMessage, data: [] };
      }
    },
    enabled: Boolean(practitionerId && startTime && finishTime),
  });
};
