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
