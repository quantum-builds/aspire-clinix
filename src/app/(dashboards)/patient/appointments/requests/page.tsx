import { Suspense } from "react";
import RequestDataTableWrapper from "./components/RequestDataTableWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { RequestDataTableSkeleton } from "./components/skeleton/RequestDataTableSkeleton";

export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="min-h-full flex flex-col gap-5 mb-10">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={true}
        showFilters={true}
      />

      <Suspense key={query + page} fallback={<RequestDataTableSkeleton />}>
        <RequestDataTableWrapper query={query} page={page} />
      </Suspense>
    </div>
  );
}
