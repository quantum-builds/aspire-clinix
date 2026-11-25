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
      id: number | string;
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

export interface SimilarPatient {
  dentallyPatientId: number;
  name: string;
  match: "EXACT" | "CLOSE";
  score: number;
}

export interface SimilarPatientsResponse {
  searchName: string;
  patients: SimilarPatient[];
}
export const useGetSimilarPatients = (
  referralRequestId: string,
  patientName?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["appointments", "similarPatients", referralRequestId, patientName ?? ""],
    queryFn: async () => {
      const response = await axiosInstance.get(
        ENDPOINTS.appointemt.similarPatients({ referralRequestId, patientName }),
      );
      return response.data.data as SimilarPatientsResponse;
    },
    enabled: enabled && (!!referralRequestId || !!patientName),
  });
};

export const useGetAppointmentsByPatient = (
  dentallyPatientId: number | null,
  practitionerId?: number | null
) => {
  return useQuery({
    queryKey: ["appointments", "patient", dentallyPatientId, practitionerId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        ENDPOINTS.appointemt.getByDentallyPatient(
          dentallyPatientId as number,
          practitionerId,
        )
      );
      return response.data.data as TAppointment[];
    },
    enabled: !!dentallyPatientId && !!practitionerId,
  });
};
