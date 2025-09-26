import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPractice } from "@/types/practice";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";

export async function getPractices() {
  try {
    const response = await axiosInstance.get(ENDPOINTS.practices.getAll);
    const responseData: Response<TPractice[]> = response.data;
    const practices: TPractice[] = responseData.data;

    const uploads = await Promise.all(
      practices.map(async (practice) => {
        if (practice.logoUrl) {
          const imageResponse = await getAMedia(practice.logoUrl);
          return imageResponse;
        }
      })
    );

    practices.forEach((practice, index) => {
      practice.logo = uploads[index];
    });

    responseData.data = practices;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching practices: ", errorMessage);

      return { errorMessage };
    }
  }
}

export async function getPractice(id: string) {
  try {
    const response = await axiosInstance.get(ENDPOINTS.practices.getById(id));
    const responseData: Response<TPractice> = response.data;
    const practice: TPractice = responseData.data;

    const upload = practice.logoUrl
      ? await getAMedia(practice.logoUrl)
      : // : "/uploads/aspire-clinic/images/placeholder.png";
        null;

    practice.logo = upload;

    responseData.data = practice;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching practice: ", errorMessage);

      return { errorMessage };
    }
  }
}
