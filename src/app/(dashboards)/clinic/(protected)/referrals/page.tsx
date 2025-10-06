import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { ReferralRequestStatus } from "@prisma/client";
import ReferralatDaTableWrapper from "./components/ReferralDataTableWrapper";

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
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals"
        showSearch={true}
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

      <Suspense
        key={query + page + status + ts}
        fallback={<div>Loading.....</div>}
      >
        <ReferralatDaTableWrapper query={query} page={page} status={status} />
      </Suspense>
    </div>
  );
}
