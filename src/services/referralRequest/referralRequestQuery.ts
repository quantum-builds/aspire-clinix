import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { Response } from "@/types/common";
import { TReferralForm } from "@/types/referral-form";
import {
  TReferralRequest,
  TReferralRequestResponse,
} from "@/types/referral-request";
import axios from "axios";
import { getAMedia } from "../s3/s3Query";

export async function getReferralRequests({
  page,
  search,
  on,
  before,
  after,
  status,
  pageType,
  statsOnly = false,
}: {
  page?: number;
  search?: string;
  on?: string;
  before?: string;
  after?: string;
  status?: string;
  pageType?: string;
  statsOnly?: boolean;
}) {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(
      ENDPOINTS.referralRequest.get(
        statsOnly,
        page,
        search,
        on,
        before,
        after,
        status,
        pageType,
      ),
    );
    const responseData: Response<TReferralRequestResponse> = response.data;
    const referralRequests = responseData.data;

    console.log("Referral Requests Response Data:", referralRequests.referralRequests);

    const upload = referralRequests.fileUrl
      ? await getAMedia(referralRequests.fileUrl)
      : null;
    referralRequests.file = upload?.files?.[0] ?? null;
    responseData.data = referralRequests;

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching referral requests: ", errorMessage);

      return { errorMessage };
    }
  }
}

export async function getReferralRequest(id: string) {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(
      ENDPOINTS.referralRequest.getById(id),
    );

    const responseData: Response<TReferralRequest> = response.data;
    const referralForm: TReferralForm = responseData.data.referralForm;

    const pdfUrls = Array.isArray(referralForm.medicalHistoryPdfUrl)
      ? referralForm.medicalHistoryPdfUrl
      : referralForm.medicalHistoryPdfUrl
        ? [referralForm.medicalHistoryPdfUrl]
        : [];

    const uploads = await Promise.all(
      pdfUrls.map((url) => getAMedia(url))
    );
    referralForm.medicalHistoryPdf = uploads
      .map((u) => (Array.isArray(u) ? u?.[0]?.url : u?.files?.[0]?.url))
      .filter(Boolean) as string[];

    const cbctUpload = referralForm.cbctReportPdfUrl
      ? await getAMedia(referralForm.cbctReportPdfUrl)
      : null;

    referralForm.cbctReportPdf = cbctUpload?.files?.[0]?.url;

    responseData.data.referralForm = referralForm;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching referral: ", errorMessage);

      return { errorMessage };
    }
  }
}
