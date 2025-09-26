import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPatient, TPatientCreate } from "@/types/patient";
import { useMutation } from "@tanstack/react-query";

export const usePatchPatient = () => {
  return useMutation({
    mutationFn: async ({
      partialPatient,
      id,
    }: {
      partialPatient: Partial<TPatientCreate>;
      id: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.patient.editPatient(id),
        partialPatient
      );

      const patient: TPatient = response.data.data;

      // const upload = patient.fileUrl ? await getAMedia(patient.fileUrl) : null;

      // patient.file = upload;
      return patient;
    },
  });
};
