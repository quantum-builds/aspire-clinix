import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { ResoucrceType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";

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

      // Prefix with a random id so uploads with the same name don't overwrite each other
      const fileName = `${nanoid(10)}-${selectedFile.name}`;

      const response = await axiosInstance.get(ENDPOINTS.s3.getSignedUrl, {
        params: {
          fileName,
          fileType: fileType,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
        },
      });

      const data = response.data;

      if (!data.success) throw new Error("Failed to get signed URL");

      const resp = await fetch(data.url, {
        method: "PUT",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });

      if (!resp.ok) {
        throw new Error(`S3 upload failed with status ${resp.status}`);
      }

      return { name: fileName };
    },
    onError: (err) => {
      console.error("Upload error:", err);
    },
    onSuccess: () => {
      console.log("File uploaded successfully!");
    },
  });
};
