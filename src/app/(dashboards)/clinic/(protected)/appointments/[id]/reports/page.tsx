import { Suspense } from "react";
import ReportGridWrapper from "./components/ReportGridWrapper";
import ReportGridWrapperSkeleton from "./components/skeletons/ReportGridWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function ReferralDetailsPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const title = searchParams?.query || "";

  return (
    <div className="flex flex-col gap-5 min-h-screen">
      <PageTopBar
        pageHeading="Reports"
        statusOptions={[]}
        showFilters={false}
        showSearch={true}
        showBackBtn={true}
      />
      <Suspense key={id + title} fallback={<ReportGridWrapperSkeleton />}>
        <ReportGridWrapper id={id} title={title} />
      </Suspense>
    </div>
  );
}
