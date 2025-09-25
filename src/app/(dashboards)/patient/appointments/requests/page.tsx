import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import { Suspense } from "react";
import { RequestDataTableSkeleton } from "./components/skeleton/RequestDataTableSkeleton";
import RequestDataTableWrapper from "./components/RequestDataTableWrapper";

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
    <div className=" w-full min-h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointment Requests</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter request no. for appointment requests" />
          <DateFilter />
        </div>
      </div>

      <Suspense key={query + page} fallback={<RequestDataTableSkeleton />}>
        <RequestDataTableWrapper query={query} page={page} />
      </Suspense>
    </div>
  );
}
