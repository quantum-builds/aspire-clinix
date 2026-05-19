import { axiosInstance, ENDPOINTS } from "@/config/api-config";

export interface S3File {
  fileName: string;
  url: string;
  type: string;
  contentType: string;
  size: number;
  lastModified: string | null;
}

export async function getAMedia(backgroundContent: string) {
  try {
    if (!backgroundContent) return [];

    console.log("fetching media for ", backgroundContent);
    const uploadResponse = await axiosInstance.get(
      `${ENDPOINTS.uploads.getMedia}?fileName=${backgroundContent}`,
    );
    console.log(
      "response from get a media is ",
      JSON.stringify(uploadResponse.data, null, 2),
    );
    return uploadResponse.data;
  } catch (err) {
    console.error(" Error in getting media ", err);
    return [];
  }
}
