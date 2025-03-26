import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { CreateDiscount, UpdateDiscount } from "@/types/discount";
import { useMutation } from "@tanstack/react-query";

export async function getAllDiscounts() {
  try {
    const response = await axiosInstance.get(ENDPOINTS.discount.getAll);
    return response.data.data;
  } catch (err) {
    console.error("Error in getting discounts", err);
  }
}

export async function getDiscount(id: string) {
  try {
    const response = await axiosInstance.get(ENDPOINTS.discount.get(id));
    return response.data.data;
  } catch (err) {
    console.error("Error in getting a discount", err);
  }
}

export const { mutate: createDiscount } = useMutation({
  mutationFn: async ({ discount }: { discount: CreateDiscount }) => {
    const response = await axiosInstance.post(ENDPOINTS.discount.create, {
      discount,
    });
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in creating discount", error);
  },
  onSuccess: (data) => {
    console.log("Discount created successfully", data);
  },
});

export const { mutate: updateDiscount } = useMutation({
  mutationFn: async ({
    updatedDiscount,
  }: {
    updatedDiscount: UpdateDiscount;
  }) => {
    const response = await axiosInstance.put(
      ENDPOINTS.discount.update(updatedDiscount.id),
      { updatedDiscount }
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in updating discount", error);
  },
  onSuccess: (data) => {
    console.log("Discount updated successfully", data);
  },
});

export const { mutate: deleteDiscount } = useMutation({
  mutationFn: async ({ discountId }: { discountId: string }) => {
    const response = await axiosInstance.delete(
      ENDPOINTS.discount.delete(discountId)
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in deleting discount", error);
  },
  onSuccess: (data) => {
    console.log("Discount deleted successfully", data);
  },
});
