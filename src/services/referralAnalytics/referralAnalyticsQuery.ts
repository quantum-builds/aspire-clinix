import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { Response } from "@/types/common";
import {
  TReferralAnalyticsFilters,
  TReferralAnalyticsInterval,
  TReferralBreakdown,
  TReferralTrend,
  TTopReferrers,
} from "@/types/referral-analytics";
import axios from "axios";

export async function getReferralTrend({
  after,
  before,
  specialty,
  practice,
  interval,
}: TReferralAnalyticsFilters & { interval?: TReferralAnalyticsInterval }) {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(
      ENDPOINTS.analytics.referralTrend(
        after,
        before,
        specialty,
        practice,
        interval,
      ),
    );
    const responseData: Response<TReferralTrend> = response.data;

    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching referral trend: ", errorMessage);

      return { errorMessage };
    }
  }
}

export async function getReferralBreakdown({
  after,
  before,
  specialty,
  practice,
}: TReferralAnalyticsFilters) {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(
      ENDPOINTS.analytics.referralBreakdown(after, before, specialty, practice),
    );
    const responseData: Response<TReferralBreakdown> = response.data;

    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching referral breakdown: ", errorMessage);

      return { errorMessage };
    }
  }
}

export async function getTopReferrers({
  after,
  before,
  specialty,
  practice,
  limit,
}: TReferralAnalyticsFilters & { limit?: number }) {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(
      ENDPOINTS.analytics.topReferrers(
        after,
        before,
        specialty,
        practice,
        limit,
      ),
    );
    const responseData: Response<TTopReferrers> = response.data;

    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching top referrers: ", errorMessage);

      return { errorMessage };
    }
  }
}
