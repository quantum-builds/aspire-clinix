import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";
import { CreatePlan, UpdatePlan } from "@/types/plan";

export async function getAllPlans() {
  try {
    const response = await axiosInstance.get(ENDPOINTS.plan.getAll);
    return response.data.data;
  } catch (err) {
    console.error("Error in getting plans ", err);
  }
}

export async function getPlan(id: string) {
  try {
    const response = await axiosInstance.get(ENDPOINTS.plan.get(id));
    return response.data.data;
  } catch (err) {
    console.error("Error in getting a plan ", err);
  }
}

export const { mutate: createPlan } = useMutation({
  mutationFn: async ({ plan }: { plan: CreatePlan }) => {
    const response = await axiosInstance.post(ENDPOINTS.plan.create, {
      plan,
    });

    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in creating plan ", error);
  },
  onSuccess: (data) => {
    console.log("Plan created successfully ", data);
  },
});

export const { mutate: updatePlan } = useMutation({
  mutationFn: async ({ updatedPlan }: { updatedPlan: UpdatePlan }) => {
    const response = await axiosInstance.put(
      ENDPOINTS.plan.update(updatedPlan.id),
      { updatedPlan }
    );

    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in updating plan ", error);
  },
  onSuccess: (data) => {
    console.log("Plan updated successfully ", data);
  },
});

export const { mutate: deletePlan } = useMutation({
  mutationFn: async ({ planId }: { planId: string }) => {
    const response = await axiosInstance.delete(ENDPOINTS.plan.delete(planId));
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in deleting plan ", error);
  },
  onSuccess: (data) => {
    console.log("Plan deleted successfully ", data);
  },
});
