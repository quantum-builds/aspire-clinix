import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointment, TChangeAppointmentState } from "@/types/appointment";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useGetAppointmentsByPatient = (patientName: string) => {
  return useQuery({
    queryKey: ["appointments", "patient", patientName],
    queryFn: async () => {
      const response = await axiosInstance.get(
        ENDPOINTS.appointemt.getByPatientName(patientName)
      );
      return response.data.data as TAppointment[];
    },
    enabled: !!patientName,
  });
};

