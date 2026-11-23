import { Response } from "@/types/common";
import { TReferralBreakdown } from "@/types/referral-analytics";
import { getReferralBreakdown } from "@/services/referralAnalytics/referralAnalyticsQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import ReferralStatusChart from "./ReferralStatusChart";
import ReferralFunnelChart from "./ReferralFunnelChart";
import ReferralSpecialtyChart from "./ReferralSpecialtyChart";
import CallStatusChart from "./CallStatusChart";

interface ReferralBreakdownWrapperProps {
  after: string;
  before: string;
}

export default async function ReferralBreakdownWrapper({
  after,
  before,
}: ReferralBreakdownWrapperProps) {
  const response: Response<TReferralBreakdown> = await getReferralBreakdown({
    after,
    before,
  });

  if (!response.status || !response.data) {
    return <NoContent1 />;
  }

  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-6">
      <ReferralStatusChart status={response.data.status} />
      <ReferralFunnelChart funnel={response.data.funnel} />
      <ReferralSpecialtyChart specialty={response.data.specialty} />
      <CallStatusChart callStatus={response.data.callStatus} />
    </div>
  );
}
