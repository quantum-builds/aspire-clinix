import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAdmin, TAdminCreate, TAdminVerify} from "@/types/admin";
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

export const useVerifyAdmin = () => {
  return useMutation({
    mutationFn: async ({ verifyAdmin }: { verifyAdmin: TAdminVerify }) => {
      const response = await axiosInstance.post(ENDPOINTS.admin.verify, {
        verifyAdmin,
      });
      return response;
    },
  });
};

export const useToCreateAdmin = () => {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.admin.createAdmin,
        { email, otp },
      );
      return response.data;
    },
  });
};
