import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { ReferralRequestStatus } from "@prisma/client";
import ReferralatDaTableWrapper from "./components/ReferralDataTableWrapper";
import ReferralDataTableSkeleton from "./components/skeletons/ReferralDataTable";
import StatsCardWrapper from "./components/StatsCardWrapper";
import StatusCardSkeleton from "./components/skeletons/StatusWrapper";

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
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals"
        showSearch={true}
        searchPlaceHolder="Search By Name"
        showFilters={true}
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
        <ReferralatDaTableWrapper query={query} page={page} status={status} on={on} before={before} after={after} />
      </Suspense>
    </div>
  );
}
