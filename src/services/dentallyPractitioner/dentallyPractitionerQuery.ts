import { axiosInstance } from "@/config/api-config";
import { useQuery } from "@tanstack/react-query";

export const useGetDentallyPractitioners = () => {
  return useQuery({
    queryKey: ["dentally-practitioners"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/dentally-practitioners");
      return response.data.data;
    },
  });
};
