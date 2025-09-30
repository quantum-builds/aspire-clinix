import LetterReportGridSkeleton from "./LetterReportGrid";
import PatientRDentistDetailsSkeleton from "./PatientRDentistDetails";
import VideoReportGridSkeleton from "./VideoReportGrid";

export default function ReportGridWrapperSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {/* Patient & Dentist Details */}
      <PatientRDentistDetailsSkeleton />

      {/* Reports */}
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGridSkeleton />
        <LetterReportGridSkeleton />
      </div>
    </div>
  );
}
