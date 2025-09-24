import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointmentRequestCreate } from "@/types/appointment-request";
import { useMutation } from "@tanstack/react-query";

export const useCreateAppointmentRequests = () => {
  return useMutation({
    mutationFn: async ({
      appointmentRequest,
    }: {
      appointmentRequest: TAppointmentRequestCreate;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.appointemtRequest.post,
        appointmentRequest
      );
      return response.data;
    },
  });
};
