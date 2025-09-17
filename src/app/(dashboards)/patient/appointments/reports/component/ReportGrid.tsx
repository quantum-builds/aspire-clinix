import { TDentistDeatils, TReport } from "@/types/common";
import DentistDetails from "./DentistDetails";
import { ResoucrceType } from "@prisma/client";
import VideoReportGrid from "./VideoReportGrid";
import LetterReportGrid from "./LetterReportGrid";

interface ReportGridProps {
  reports: TReport[];
  dentistDetails: TDentistDeatils;
}

export default function ReportGrid({
  reports,
  dentistDetails,
}: ReportGridProps) {
  const videoReports = reports.filter(
    (report) => report.fileType !== ResoucrceType.PDF
  );
  const letterReports = reports.filter(
    (report) => report.fileType !== ResoucrceType.PDF
  );
  return (
    <div className="flex flex-col gap-7 bg-dashboardBackground">
      <DentistDetails dentistDetails={dentistDetails} />
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGrid reports={videoReports} />
        <LetterReportGrid reports={letterReports} />
      </div>
    </div>
  );
}
