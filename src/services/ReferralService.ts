import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { CreateReferralForm, UpdateReferralForm } from "@/types/referral-form";
import { useMutation } from "@tanstack/react-query";

export async function getReferral(id: string) {
  try {
    const response = await axiosInstance.get(ENDPOINTS.referralForm.get(id));
    return response.data.data;
  } catch (err) {
    console.error("Error in getting referral", err);
  }
}

export async function getDentistReferrals(dentistId: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.referralForm.getDentistForms(dentistId)
    );
    return response.data.data;
  } catch (err) {
    console.error("Error in getting dentist referrals", err);
  }
}

export const { mutate: createReferral } = useMutation({
  mutationFn: async ({ form }: { form: CreateReferralForm }) => {
    const response = await axiosInstance.post(ENDPOINTS.referralForm.create, {
      form,
    });
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in creating referral", error);
  },
  onSuccess: (data) => {
    console.log("Referral created successfully", data);
  },
});

export const { mutate: updateReferral } = useMutation({
  mutationFn: async ({ updatedForm }: { updatedForm: UpdateReferralForm }) => {
    const response = await axiosInstance.put(
      ENDPOINTS.referralForm.update(updatedForm.id),
      { updatedForm }
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in updating referral", error);
  },
  onSuccess: (data) => {
    console.log("Referral updated successfully", data);
  },
});

// Delete a referral
export const { mutate: deleteReferral } = useMutation({
  mutationFn: async ({ referralId }: { referralId: string }) => {
    const response = await axiosInstance.delete(
      ENDPOINTS.referralForm.delete(referralId)
    );
    return response.data.data;
  },
  onError: (error) => {
    console.error("Error in deleting referral", error);
  },
  onSuccess: (data) => {
    console.log("Referral deleted successfully", data);
  },
});
