import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointmentCreate } from "@/types/appointment";
import { useMutation } from "@tanstack/react-query";

export const usePatchAppointment = () => {
  return useMutation({
    mutationFn: async ({
      appointment,
      id,
      patientId,
      dentistId,
    }: {
      appointment: Partial<TAppointmentCreate>;
      id: string;
      patientId?: string;
      dentistId?: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.appointemt.patch(id, patientId, dentistId),
        appointment
      );
      return response.data.data;
    },
  });
};

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: async ({
      appointment,
    }: {
      appointment: TAppointmentCreate;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.appointemt.post,
        appointment
      );
      return response.data.data;
    },
  });
};
