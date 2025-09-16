import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import { TDentistDeatils, TPatientDetails, TReport } from "@/types/common";
import { ResoucrceType } from "@prisma/client";
import PatientDetails from "./PatientDetails";

interface ReportGridProps {
  reports: TReport[];
  patientDetails: TPatientDetails;
}

export default function ReportGrid({
  reports,
  patientDetails,
}: ReportGridProps) {
  const videoReports = reports.filter(
    (report) => report.fileType !== ResoucrceType.PDF
  );
  const letterReports = reports.filter(
    (report) => report.fileType !== ResoucrceType.PDF
  );
  return (
    <div className="flex flex-col gap-7 bg-dashboardBackground">
      <PatientDetails patientDetails={patientDetails} />
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGrid reports={videoReports} />
        <LetterReportGrid reports={letterReports} />
      </div>
    </div>
  );
}
