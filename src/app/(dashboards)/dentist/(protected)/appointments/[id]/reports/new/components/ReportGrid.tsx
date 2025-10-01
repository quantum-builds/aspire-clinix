import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";

export default function ReportGrid() {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBackground">
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGrid reports={[]} isNewUploadPage={true} />
        <LetterReportGrid reports={[]} isNewUploadPage={true} />
      </div>
    </div>
  );
}
