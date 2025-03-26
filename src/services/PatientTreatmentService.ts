import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import {
  CreatePatientTreatment,
  UpdatePatientTreatment,
} from "@/types/patient-treatment";
import { useMutation } from "@tanstack/react-query";

export async function getAllPatientTreatments(patientId: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.patientTreatment.getAll(patientId)
    );
    return response.data.data;
  } catch (err) {
    console.error("Error in getting patient treatments", err);
  }
}

export async function getPatientTreatment(id: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.patientTreatment.get(id)
    );
    return response.data.data;
  } catch (err) {
    console.error("Error in getting a patient treatment", err);
  }
}

export const { mutate: createPatientTreatment } = useMutation({
  mutationFn: async ({
    patientTreatment,
  }: {
    patientTreatment: CreatePatientTreatment;
  }) => {
    const response = await axiosInstance.post(
      ENDPOINTS.patientTreatment.create,
      { patientTreatment }
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in creating patient treatment", error);
  },
  onSuccess: (data) => {
    console.log("Patient treatment created successfully", data);
  },
});

export const { mutate: updatePatientTreatment } = useMutation({
  mutationFn: async ({
    updatedPatientTreatment,
  }: {
    updatedPatientTreatment: UpdatePatientTreatment;
  }) => {
    const response = await axiosInstance.put(
      ENDPOINTS.patientTreatment.update(updatedPatientTreatment.id),
      { updatedPatientTreatment }
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in updating patient treatment", error);
  },
  onSuccess: (data) => {
    console.log("Patient treatment updated successfully", data);
  },
});

export const { mutate: deletePatientTreatment } = useMutation({
  mutationFn: async ({ treatmentId }: { treatmentId: string }) => {
    const response = await axiosInstance.delete(
      ENDPOINTS.patientTreatment.delete(treatmentId)
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in deleting patient treatment", error);
  },
  onSuccess: (data) => {
    console.log("Patient treatment deleted successfully", data);
  },
});
