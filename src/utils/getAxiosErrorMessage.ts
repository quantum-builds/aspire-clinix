import { AxiosError } from "axios";
import { Response } from "@/types/common";

export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  const axiosError = error as AxiosError<Response<unknown>>;

  let message =
    axiosError?.response?.data?.message || axiosError?.message || fallback;

  if (message.toLowerCase().includes("prisma")) {
    return "Something went wrong, please try again.";
  }

  return message;
}
