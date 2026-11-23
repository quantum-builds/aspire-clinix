import { Response } from "@/types/common";
import { TTopReferrers } from "@/types/referral-analytics";
import { getTopReferrers } from "@/services/referralAnalytics/referralAnalyticsQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import TopReferrersChart from "./TopReferrersChart";
import TopReferrersTable from "./TopReferrersTable";

interface TopReferrersWrapperProps {
  after: string;
  before: string;
}

export default async function TopReferrersWrapper({
  after,
  before,
}: TopReferrersWrapperProps) {
  const response: Response<TTopReferrers> = await getTopReferrers({
    after,
    before,
    limit: 10,
  });

  if (
    !response.status ||
    !response.data ||
    !response.data.referrers ||
    response.data.referrers.length === 0
  ) {
    return <NoContent1 text="No referring dentists found for this period" />;
  }

  return (
    <>
      <TopReferrersChart referrers={response.data.referrers} />
      <TopReferrersTable referrers={response.data.referrers} />
    </>
  );
}
