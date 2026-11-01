import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TTreatment } from "@/types/treatment";
import { useQuery } from "@tanstack/react-query";

export const useGetTreatments = () => {
  return useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.treatment.getAll);
      const responseData: Response<TTreatment[]> = response.data;
      return responseData.data;
    },
  });
};

export const useGetTreatment = (id: string) => {
  return useQuery({
    queryKey: ["treatments", id],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.treatment.get(id));
      const responseData: Response<TTreatment> = response.data;
      return responseData.data;
    },
    enabled: !!id,
  });
};
