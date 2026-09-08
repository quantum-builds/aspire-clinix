import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { ReferralRequestStatus } from "@prisma/client";
import {CallStatus} from "@prisma/client";
import ReferralatDaTableWrapper from "./components/ReferralDataTableWrapper";
import ReferralDataTableSkeleton from "./components/skeletons/ReferralDataTable";
import StatsCardWrapper from "./components/StatsCardWrapper";
import StatusCardSkeleton from "./components/skeletons/StatusWrapper";
import {formatStatus} from "@/utils/formateStatus";


export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    callStatus?: string;
    page?: string;
    ts?: string;
    on?: string;
    before?: string;
    after?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const ts = new Date(searchParams?.ts || "");
  const status = searchParams?.status || "";
  const callStatus = searchParams?.callStatus || "";
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || "";

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals"
        showSearch={false}
        searchPlaceHolder="Search By Name"
        showFilters={true}
        statusOptions={[
          {
            value: ReferralRequestStatus.ASSIGNED,
            label: "ASSIGNED"
          },
          {
            value: ReferralRequestStatus.UNASSIGNED,
            label: "UNASSIGNED"
          },
          {
            value: ReferralRequestStatus.PENDING_REVIEW,
            label: "PENDING REVIEW"
          },
          {
            value: ReferralRequestStatus.ACCEPTED,
            label: "ACCEPTED"
          },
          {
            value: ReferralRequestStatus.REJECTED_BY_DENTIST,
            label: "REJECTED BY DENTIST"
          },
          {
            value: ReferralRequestStatus.REJECTED_BY_PATIENT,
            label: "REJECTED BY PATIENT"
          },
        ]}
        callStatusOptions={[
          { value: CallStatus.PENDING, label: "PENDING" },
          { value: CallStatus.REJECTED, label: "REJECTED" },
          { value: CallStatus.CONFIRM, label: "CONFIRM" },
        { value: CallStatus.AWAITING, label: "AWAITING" },
          { value: CallStatus.UNATTENDED, label: "UNATTENDED" },
        ]}
      />
      <Suspense fallback={<StatusCardSkeleton />}>
        <StatsCardWrapper />
      </Suspense>
      <Suspense
        key={query + page + status + callStatus + ts + on + before + after}
        fallback={<ReferralDataTableSkeleton />}
      >
        <ReferralatDaTableWrapper
          query={query}
          page={page}
          status={status}
          callStatus={callStatus}
          on={on}
          before={before}
          after={after}
        />
      </Suspense>
    </div>
  );
}
