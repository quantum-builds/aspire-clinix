import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { ResoucrceType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({
      selectedFile,
      fileType = ResoucrceType.VIDEO,
    }: {
      selectedFile: File;
      fileType?: string;
    }) => {
      if (!selectedFile) throw new Error("Please select a file first!");

      const response = await axiosInstance.get(ENDPOINTS.s3.getSignedUrl, {
        params: {
          fileName: selectedFile.name,
          fileType: fileType,
          fileSize: selectedFile.size,
        },
      });

      console.log("params are ", selectedFile.size);
      const data = response.data;

      if (!data.success) throw new Error("Failed to get signed URL");

      await fetch(data.url, {
        method: "PUT",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });

      return selectedFile;
    },
    onError: (err) => {
      console.error("Upload error:", err);
    },
    onSuccess: () => {
      console.log("File uploaded successfully!");
    },
  });
};
