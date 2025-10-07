import { TReferralRequestResponse } from "@/types/referral-request";
import { Response } from "@/types/common";
import { getReferralRequests } from "@/services/referralRequest/referralRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import { ClinicReferralDataTable } from "./ReferralDataTable";

interface ReferralDataTableWrapperProps {
  query: string;
  page: number;
  status: string;
  on: string
  before: string
  after: string
}

export default async function ReferralatDaTableWrapper({
  query,
  page,
  status,
  on, before, after
}: ReferralDataTableWrapperProps) {
  const response: Response<TReferralRequestResponse> =
    await getReferralRequests({
      page: page,
      search: query,
      status: status,
      on: on, before: before, after: after
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

  return (
    <>
      <div className="min-w-full overflow-x-auto">
        <ClinicReferralDataTable entries={referralRequests} />
      </div>
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
