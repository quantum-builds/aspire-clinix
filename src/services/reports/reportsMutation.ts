import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TReportCreate } from "@/types/reports";
import { useMutation } from "@tanstack/react-query";

export const useCreateReport = () => {
  return useMutation({
    mutationFn: async ({ reports }: { reports: TReportCreate[] }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.reports.create,
        reports
      );
      return response.data.data;
    },
  });
};

export const useDeleteReport = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosInstance.delete(ENDPOINTS.reports.delete(id));
      return response.data.data;
    },
  });
};
