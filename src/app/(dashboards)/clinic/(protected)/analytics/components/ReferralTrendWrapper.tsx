import { Response } from "@/types/common";
import { TReferralTrend } from "@/types/referral-analytics";
import { getReferralTrend } from "@/services/referralAnalytics/referralAnalyticsQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import ReferralTrendChart from "./ReferralTrendChart";

interface ReferralTrendWrapperProps {
  after: string;
  before: string;
}

export default async function ReferralTrendWrapper({
  after,
  before,
}: ReferralTrendWrapperProps) {
  const response: Response<TReferralTrend> = await getReferralTrend({
    after,
    before,
  });

  if (!response.status || !response.data) {
    return <NoContent1 />;
  }

  return (
    <ReferralTrendChart
      interval={response.data.interval}
      points={response.data.points}
    />
  );
}
