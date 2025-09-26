import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointmentCreate } from "@/types/appointment";
import { useMutation } from "@tanstack/react-query";

export const usePatchAppointment = () => {
  return useMutation({
    mutationFn: async ({
      appointment,
      id,
      patientId,
    }: {
      appointment: Partial<TAppointmentCreate>;
      id: string;
      patientId: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.appointemt.patch(id, patientId),
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
