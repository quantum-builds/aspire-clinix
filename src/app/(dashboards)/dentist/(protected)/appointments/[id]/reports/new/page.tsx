import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import ReportGrid from "./components/ReportGrid";
import ReportGridWrapper from "./components/ReportGridWrapper";
import ReportGridWrapperSkeleton from "./components/skeleton/ReportGridWrapper";

export default async function NewReport(props: { params: { id: string } }) {
  const { id } = props.params;
  console.log("id is ", id);
  return (
    <div className="flex flex-col gap-5 min-h-[103vh]">
      <PageTopBar
        pageHeading="Reports"
        statusOptions={[]}
        showFilters={false}
        showSearch={false}
        showBackBtn={true}
      />
      <Suspense key={id} fallback={<ReportGridWrapperSkeleton/>}>
        <ReportGridWrapper id={id} />
      </Suspense>
    </div>
  );
}
