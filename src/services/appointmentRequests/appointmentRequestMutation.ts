import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import {
  TAppointmentRequest,
  TAppointmentRequestCreate,
} from "@/types/appointment-request";
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

export const useDeleteAppointmentRequests = () => {
  return useMutation({
    mutationFn: async ({
      id,
      patientId,
    }: {
      id: string;
      patientId: string;
    }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.appointemtRequest.delete(id, patientId)
      );
      return response.data.data;
    },
  });
};

export const usePatchAppointmentRequest = () => {
  return useMutation({
    mutationFn: async ({
      appointmentRequest,
      id,
    }: {
      appointmentRequest: Partial<TAppointmentRequest>;
      id: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.appointemtRequest.patch(id),
        appointmentRequest
      );
      return response.data;
    },
  });
};
