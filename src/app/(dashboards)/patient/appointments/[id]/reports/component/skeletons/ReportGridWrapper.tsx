import { DentistDetailsSkeleton } from "./DentistDetails";
import { LetterReportGridSkeleton } from "./LetterReportGrid";
import { VideoReportGridSkeleton } from "./VideoReportGrid";

export function ReportGridWrapperSkeleton() {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBackground">
      <DentistDetailsSkeleton />
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGridSkeleton />
        <LetterReportGridSkeleton />
      </div>
    </div>
  );
}
