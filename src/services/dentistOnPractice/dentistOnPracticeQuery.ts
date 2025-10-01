import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TDentistPractice } from "@/types/dentistRequest";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export async function getDentistPractice({
  dentistId,
  practiceId,
  status,
}: {
  dentistId?: string;
  practiceId?: string;
  status?: string;
}) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.dentistToPractice.get(dentistId, practiceId, status)
    );

    const responseData: Response<TDentistPractice[]> = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching data: ", errorMessage);

      return { errorMessage };
    }
  }
}

export const updateDentistPractice = () => {
  return useMutation({
    mutationFn: async ({
      dentistId,
      practiceId,
      status,
    }: {
      dentistId: string;
      practiceId: string;
      status?: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.dentistToPractice.updatedStatus(dentistId, practiceId, status)
      );

      const responseData: Response<TDentistPractice> = response.data;
      return responseData;
    },
  });
};

export const useCreateDentistPractice = () => {
  return useMutation({
    mutationFn: async ({
      dentistId,
      practiceId,
      status,
    }: {
      dentistId: string;
      practiceId: string;
      status: string;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.dentistToPractice.create(dentistId, practiceId, status)
      );

      const responseData: Response<TDentistPractice> = response.data;
      return responseData;
    },
  });
};
