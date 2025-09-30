import { Suspense } from "react";
import ReportGridWrapper from "./component/ReportGrid";
import BackButton from "@/app/(dashboards)/components/BackButton";
import { ReportGridWrapperSkeleton } from "./component/skeletons/ReportGridWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

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
    <div className="flex flex-col gap-5 min-h-[103vh]">
      <PageTopBar
        pageHeading="Reports"
        statusOptions={[]}
        showFilters={false}
        showSearch={true}
        extraBtns={<BackButton />}
      />
      <Suspense key={title + id} fallback={<ReportGridWrapperSkeleton />}>
        <ReportGridWrapper appointmentId={id} query={title} />
      </Suspense>
    </div>
  );
}
