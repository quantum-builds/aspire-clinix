import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { ReferralRequestStatus } from "@prisma/client";
import ReferralHistoryDataTableWrapper from "./components/ReferralHistoryDataTableWrapper";
import StatusCardSkeleton from "@/app/(dashboards)/clinic/(protected)/referrals/components/skeletons/StatusWrapper";
import ReferralDataTableSkeleton from "@/app/(dashboards)/clinic/(protected)/referrals/components/skeletons/ReferralDataTable";
import StatsCardWrapper from "./components/StatsCardWrapper";



export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
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
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || "";

  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <PageTopBar
        showSearch={true}
        showFilters={true}
        pageHeading="Referral History"
        statusOptions={[
          {
            value: ReferralRequestStatus.ASSIGNED,
          },
          {
            value: ReferralRequestStatus.UNASSIGNED,
          },
        ]}
      />

      <Suspense fallback={<StatusCardSkeleton />}>
        <StatsCardWrapper />
      </Suspense>
      <Suspense
        key={query + page + status + ts + on + before + after}
        fallback={<ReferralDataTableSkeleton />}
      >
        <ReferralHistoryDataTableWrapper query={query} page={page} status={status} on={on} before={before} after={after} />
      </Suspense>
    </div>
  );
}

