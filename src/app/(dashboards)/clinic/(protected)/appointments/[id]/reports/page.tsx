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
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Reports</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
          <BackButton />
        </div>
      </div>
      <Suspense key={id + title} fallback={<ReportGridWrapperSkeleton />}>
        <ReportGridWrapper id={id} title={title} />
      </Suspense>
    </div>
  );
}
