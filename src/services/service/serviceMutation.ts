import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TService } from "@/types/services";
import { useMutation } from "@tanstack/react-query";

export const useCreateService = () => {
  return useMutation({
    mutationFn: async ({ service }: { service: TService }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.services.createService,
        service
      );
      return response.data.response;
    },
    onError: (err) => {
      console.error("Service error in creating service", err);
    },
    onSuccess: (data) => {
      console.log("service created successfully", data);
    },
  });
};

export const useUpdateService = () => {
  return useMutation({
    mutationFn: async ({ service, id }: { service: TService; id: string }) => {
      const response = await axiosInstance.put(
        ENDPOINTS.services.updateAService(id),
        service
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updating service", err);
    },
    onSuccess: (data) => {
      console.log("service updated successfully", data);
    },
  });
};

export const usePatchAService = () => {
  return useMutation({
    mutationFn: async ({
      service,
      id,
    }: {
      service: Partial<TService>;
      id: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.services.patchAService(id),
        service
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updating service", err);
    },
    onSuccess: (data) => {
      console.log("service updated successfully", data);
    },
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.services.deleteAService(id)
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in deleting service", err);
    },
    onSuccess: (data) => {
      console.log("Service deleted successfully", data);
    },
  });
};
