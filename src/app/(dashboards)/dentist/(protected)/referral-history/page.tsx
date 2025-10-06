import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { ReferralRequestStatus } from "@prisma/client";
import ReferralHistoryDataTableWrapper from "./components/ReferralHistoryDataTableWrapper";



export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
    ts?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const ts = new Date(searchParams?.ts || "");
  const status = searchParams?.status || "";



  return (
    <div className="w-full min-h-[99vh] flex flex-col gap-5">
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

      <Suspense key={query} fallback={<div>Loading.....</div>}>
        <ReferralHistoryDataTableWrapper query={query} page={page} status={status} />
      </Suspense>
    </div>
  );
}

