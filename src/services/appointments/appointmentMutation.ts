import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TChangeAppointmentState } from "@/types/appointment";
import { useMutation } from "@tanstack/react-query";

export const useChangeAppointmentState = () => {
  return useMutation({
    mutationFn: async ({
      appointment,
      id,
    }: {
    appointment: TChangeAppointmentState;
      id: number;
      patientId?: number;
      dentistId?: number;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.appointemt.patch(id),
        appointment
      );
      return response.data.data;
    },
  });
};

