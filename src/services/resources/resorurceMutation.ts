import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TResourceCreate } from "@/types/resources";
import { useMutation } from "@tanstack/react-query";

export const useCreateResource = () => {
  return useMutation({
    mutationFn: async ({ resource }: { resource: TResourceCreate }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.resources.create,
        resource
      );
      return response.data.data;
    },
  });
};


export const useDeleteResource = () => {
   return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
    }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.resources.delete(id)
      );
      return response.data.data;
    },
  });
};
