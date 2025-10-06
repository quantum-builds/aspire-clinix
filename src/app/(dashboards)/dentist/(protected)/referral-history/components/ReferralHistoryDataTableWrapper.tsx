import { TReferralRequestResponse } from "@/types/referral-request";
import { DentistReferralPageTYpe, Response } from "@/types/common";
import { getReferralRequests } from "@/services/referralRequest/referralRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import StatsCardWrapper from "./StatsCardWrapper";
import { ReferralHistoryDataTable } from "./ReferralHistoryDataTable";

interface ReferralHistoryDataTableWrapperProps {
  query: string;
  page: number;
  status: string;
}

export default async function ReferralHistoryDataTableWrapper({
  query,
  page,
  status,
}: ReferralHistoryDataTableWrapperProps) {
  const response: Response<TReferralRequestResponse> =
    await getReferralRequests({
      page: page,
      search: query,
      status: status,
      pageType:DentistReferralPageTYpe.HISTORY
    });

  if (
    !response.status ||
    !response.data ||
    !response.data.referralRequests ||
    response.data.referralRequests.length === 0
  ) {
    return (
      <>
        <NoContent1 />
      </>
    );
  }
  const referralRequests = response.data.referralRequests;
  const total = response.data.pagination.totalPages;

  console.log(referralRequests);
  return (
    <>
      <StatsCardWrapper />
      <div className="min-w-full overflow-x-auto">
        <ReferralHistoryDataTable entries={referralRequests} />
      </div>
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
