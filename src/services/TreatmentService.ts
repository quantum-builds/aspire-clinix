import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { CreateTreatment, UpdateTreatment } from "@/types/treatment";
import { useMutation } from "@tanstack/react-query";

export async function getAllTreatments() {
  try {
    const response = await axiosInstance.get(ENDPOINTS.treatment.getAll);
    return response.data.data;
  } catch (err) {
    console.error("Error in getting treatments", err);
  }
}

export async function getTreatment(id: string) {
  try {
    const response = await axiosInstance.get(ENDPOINTS.treatment.get(id));
    return response.data.data;
  } catch (err) {
    console.error("Error in getting a treatment", err);
  }
}

export const { mutate: createTreatment } = useMutation({
  mutationFn: async ({ treatment }: { treatment: CreateTreatment }) => {
    const response = await axiosInstance.post(ENDPOINTS.treatment.create, {
      treatment,
    });
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in creating treatment", error);
  },
  onSuccess: (data) => {
    console.log("Treatment created successfully", data);
  },
});

export const { mutate: updateTreatment } = useMutation({
  mutationFn: async ({
    updatedTreatment,
  }: {
    updatedTreatment: UpdateTreatment;
  }) => {
    const response = await axiosInstance.put(
      ENDPOINTS.treatment.update(updatedTreatment.id),
      { updatedTreatment }
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in updating treatment", error);
  },
  onSuccess: (data) => {
    console.log("Treatment updated successfully", data);
  },
});

export const { mutate: deleteTreatment } = useMutation({
  mutationFn: async ({ treatmentId }: { treatmentId: string }) => {
    const response = await axiosInstance.delete(
      ENDPOINTS.treatment.delete(treatmentId)
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in deleting treatment", error);
  },
  onSuccess: (data) => {
    console.log("Treatment deleted successfully", data);
  },
});
