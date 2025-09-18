import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TResource, TResourceResponse } from "@/types/resources";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";

export async function getResources(
  page?: number,
  search?: string,
  fileType?: string
) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.resources.getAll(page, fileType, search)
    );
    console.log("111111111111 ");
    const responseData: Response<TResourceResponse> = response.data;

    let resources: TResource[] | undefined = undefined;
    if (fileType === "PDF") {
      resources = responseData.data.resources.pdfs;
    } else if (fileType === "VIDEO") {
      resources = responseData.data.resources.videos;
    }

    console.log("2222222222");
    if (resources === undefined) {
      throw new Error("Resources not found");
    }

    console.log("333333333333333");
    const uploads = await Promise.all(
      resources.map(async (resource) => {
        if (resource.fileUrl) {
          const imageResponse = await getAMedia(resource.fileUrl);
          return imageResponse;
        }
      })
    );
    console.log("44444444444444");

    resources.forEach((resource, index) => {
      resource.file = uploads[index];
    });
    if (fileType === "PDF") {
      responseData.data.resources.pdfs = resources;
    } else if (fileType === "VIDEO") {
      responseData.data.resources.videos = resources;
    }
    console.log("5555555555555555555");
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching resources: ", errorMessage);

      return { errorMessage };
    }
  }
}
