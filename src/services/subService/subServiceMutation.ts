import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TService } from "@/types/services";
import { TSubService } from "@/types/subService";
import { useMutation } from "@tanstack/react-query";

export const useCreateSubService = () => {
  return useMutation({
    mutationFn: async ({ subService }: { subService: TSubService }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.subServices.createSubService,
        subService
      );
      return response.data.response;
    },
    onError: (err) => {
      console.error("Service error in creating sub service", err);
    },
    onSuccess: (data) => {
      console.log("sub service created successfully", data);
    },
  });
};

export const useUpdateSubService = () => {
  return useMutation({
    mutationFn: async ({
      subService,
      id,
    }: {
      subService: TSubService;
      id: string;
    }) => {
      const response = await axiosInstance.put(
        ENDPOINTS.subServices.updateASubService(id),
        subService
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updating sub service", err);
    },
    onSuccess: (data) => {
      console.log("sub service updated successfully", data);
    },
  });
};

export const usePatchASubService = () => {
  return useMutation({
    mutationFn: async ({
      subService,
      id,
    }: {
      subService: Partial<TSubService>;
      id: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.subServices.patchASubService(id),
        subService
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updating sub service", err);
    },
    onSuccess: (data) => {
      console.log("sub service updated successfully", data);
    },
  });
};

export const useDeleteSubService = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.subServices.deleteASubService(id)
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in deleting sub service", err);
    },
    onSuccess: (data) => {
      console.log("sub service deleted successfully", data);
    },
  });
};
