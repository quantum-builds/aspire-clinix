import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import { TReport } from "@/types/reports";
import { ResoucrceType } from "@prisma/client";
import { Suspense } from "react";
import PatientRDentistDetails from "./components/PatientDentistDetails";
import ReportGridWrapper from "./components/ReportGridWrapper";
import BackButton from "@/app/(dashboards)/components/BackButton";
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
