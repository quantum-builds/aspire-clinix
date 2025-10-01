import { Suspense } from "react";
import Button from "@/app/(dashboards)/components/Button";
import ReportGridWrapperSkeleton from "@/app/(dashboards)/clinic/(protected)/appointments/[id]/reports/components/skeletons/ReportGridWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import ReportGridWrapper from "./components/ReportGrid";

export default async function ReportsPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    query?: string;
    ts?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const title = searchParams?.query || "";
  const ts = new Date(searchParams?.ts || "");
  const { id } = props.params;

  return (
    <div className="flex flex-col gap-5 min-h-[103vh]">
      <PageTopBar
        pageHeading="Reports"
        statusOptions={[]}
        showFilters={false}
        showSearch={true}
        showBackBtn={true}
        extraBtns={
          <>
            <div className="flex justify-end">
              <Button
                text="Create New Report"
                href={`/dentist/appointments/${id}/reports/new`}
                className="w-fit"
              />
            </div>
          </>
        }
      />
      <Suspense key={title + ts} fallback={<ReportGridWrapperSkeleton />}>
        <ReportGridWrapper appointmentId={id} query={title} />
      </Suspense>
    </div>
  );
}
