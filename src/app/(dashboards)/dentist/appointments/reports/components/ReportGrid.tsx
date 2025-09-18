import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import { TDentistDeatils, TPatientDetails } from "@/types/common";
import { ResoucrceType } from "@prisma/client";
import PatientDetails from "./PatientDetails";
import { TReport } from "@/types/reports";

interface ReportGridProps {
  reports: TReport[];
  patientDetails: TPatientDetails;
  isNewUploadPage?: boolean;
}

export default function ReportGrid({
  reports,
  patientDetails,
  isNewUploadPage = false,
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
        <VideoReportGrid
          reports={videoReports}
          isNewUploadPage={isNewUploadPage}
        />
        <LetterReportGrid
          reports={letterReports}
          isNewUploadPage={isNewUploadPage}
        />
      </div>
    </div>
  );
}
