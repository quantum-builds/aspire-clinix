import { TReferralRequestResponse } from "@/types/referral-request";
import { DentistReferralPageTYpe, Response } from "@/types/common";
import { getReferralRequests } from "@/services/referralRequest/referralRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import StatsCardWrapper from "./StatsCardWrapper";
import { ReferralRequestDataTable } from "./ReferralRequestDataTable";

interface ReferralRequestDataTableWrapperProps {
  query: string;
  page: number;
  status: string;
}

export default async function ReferralRequestDataTableWrapper({
  query,
  page,
  status,
}: ReferralRequestDataTableWrapperProps) {
  const response: Response<TReferralRequestResponse> =
    await getReferralRequests({
      page: page,
      search: query,
      status: status,
      pageType:DentistReferralPageTYpe.REQUEST
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
        <ReferralRequestDataTable entries={referralRequests} />
      </div>
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
