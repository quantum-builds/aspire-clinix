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

        const url = `${ENDPOINTS.availability.getAll}?${params.toString()}`;

        console.log("[Availability API] Request URL:", url);
        console.log("[Availability API] Params:", {
          practitionerId,
          startTime,
          finishTime,
          duration,
        });

        const response = await axiosInstance.get(url);

        console.log("[Availability API] Response:", {
          status: response.data?.status,
          message: response.data?.message,
          data: response.data?.data,
        });

        return response.data as Response<TAvailabilitySlot[]>;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("[Availability API] Error response:", {
            status: error.response.status,
            data: error.response.data,
          });
          return error.response.data as Response<TAvailabilitySlot[]>;
        }

        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error("[Availability API] Error:", errorMessage);

        return { status: false, message: errorMessage, data: [] };
      }
    },
    enabled: Boolean(practitionerId && startTime && finishTime),
    staleTime: 60 * 1000, // Don't refetch for 60 seconds
  });
};
