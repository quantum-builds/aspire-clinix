import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";
import { TReport, TReportResponse } from "@/types/reports";

export async function getReports({
  search,
  appointmentId,
  on,
  before,
  after,
}: {
  search?: string;
  appointmentId?: string;
  on?: string;
  before?: string;
  after?: string;
}) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.reports.get(search, appointmentId, on, before, after)
    );
    const responseData: Response<TReportResponse> = response.data;

    let reports: {
      pdfs: TReport[];
      videos: TReport[];
    } = {
      pdfs: responseData.data.reports?.pdfs || [],
      videos: responseData.data.reports?.videos || [],
    };

    // fetch signed URLs for PDFs
    const pdfUploads =
      reports.pdfs.length > 0
        ? await Promise.all(
            reports.pdfs.map(async (resource) => {
              if (resource.fileUrl) {
                return await getAMedia(resource.fileUrl);
              }
              return null;
            })
          )
        : [];

    reports.pdfs =
      reports.pdfs.length > 0
        ? reports.pdfs.map((resource, index) => ({
            ...resource,
            file: pdfUploads[index] || null,
          }))
        : [];

    // fetch signed URLs for Videos
    const videoUploads =
      reports.videos.length > 0
        ? await Promise.all(
            reports.videos.map(async (resource) => {
              if (resource.fileUrl) {
                return await getAMedia(resource.fileUrl);
              }
              return null;
            })
          )
        : [];

    reports.videos =
      reports.videos.length > 0
        ? reports.videos.map((resource, index) => ({
            ...resource,
            file: videoUploads[index] || null,
          }))
        : [];

    // update the responseData with modified reports
    responseData.data.reports = reports;

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
