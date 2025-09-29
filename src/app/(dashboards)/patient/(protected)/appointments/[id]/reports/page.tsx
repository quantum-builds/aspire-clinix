import { TDentistDeatils } from "@/types/common";
import { Suspense } from "react";
import ReportGridWrapper from "./component/ReportGrid";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import BackButton from "@/app/(dashboards)/components/BackButton";
import { ReportGridWrapperSkeleton } from "./component/skeletons/ReportGridWrapper";

export default async function ReportsPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const title = searchParams?.query || "";

  return (
    <div className="min-h-full flex flex-col gap-7 mb-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Reports</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Report title" />
          <BackButton />
        </div>
      </div>
      <Suspense key={title + id} fallback={<ReportGridWrapperSkeleton />}>
        <ReportGridWrapper appointmentId={id} query={title} />
      </Suspense>
    </div>
  );
}
