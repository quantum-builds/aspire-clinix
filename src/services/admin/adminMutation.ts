import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAdmin, TAdminCreate } from "@/types/admin";
import { useMutation } from "@tanstack/react-query";

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: async ({ adminCreate }: { adminCreate: TAdminCreate }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.admin.createAdmin,
        adminCreate
      );

      const patient: TAdmin = response.data.data;
      return patient;
    },
  });
};

export const usePatchAdmin = () => {
  return useMutation({
    mutationFn: async ({
      partialAdmin,
    }: {
      partialAdmin: Partial<TAdminCreate>;
    }) => {
      console.log("patient patient is ", partialAdmin);
      const response = await axiosInstance.patch(
        ENDPOINTS.admin.editAdmin,
        partialAdmin
      );

      const admin: TAdmin = response.data.data;
      return admin;
    },
  });
};
