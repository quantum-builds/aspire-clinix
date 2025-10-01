import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import { ResoucrceType } from "@prisma/client";
import PatientDetails from "./PatientDetails";
import { TReport, TReportResponse } from "@/types/reports";
import { Response } from "@/types/common";
import { getReports } from "@/services/reports/reportsQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { TPatient } from "@/types/patient";

interface ResourceGridWrapperProps {
  query: string;
  appointmentId: string;
}

interface ReportGridProps {
  videoReports: TReport[];
  letterReports: TReport[];
  patientDetails?: TPatient;
  isNewUploadPage?: boolean;
}

export default async function ReportGridWrapper({
  query,
  appointmentId,
}: ResourceGridWrapperProps) {
  const response: Response<TReportResponse> = await getReports({
    search: query,
    appointmentId: appointmentId,
  });

  if (
    !response.status ||
    (!response.data.reports.pdfs && !response.data.reports.videos) ||
    (response.data.reports.pdfs?.length === 0 &&
      response.data.reports.videos?.length === 0)
  ) {
    return <NoContent1 />;
  }

  const patientDetails =
    response.data.reports.pdfs && response.data.reports.pdfs?.length > 0
      ? response.data.reports.pdfs[0].patient
      : response.data.reports.videos && response.data.reports.videos?.length > 0
      ? response.data.reports.videos[0].patient
      : undefined;
  const pdfs = response.data.reports.pdfs;
  const videos = response.data.reports.videos;

  return (
    <>
      <ReportGrid
        videoReports={videos ?? []}
        letterReports={pdfs ?? []}
        patientDetails={patientDetails}
      />
    </>
  );
}

function ReportGrid({
  videoReports,
  letterReports,
  patientDetails,
  isNewUploadPage = false,
}: ReportGridProps) {
  // const videoReports = reports.filter(
  //   (report) => report.fileType !== ResoucrceType.PDF
  // );
  // const letterReports = reports.filter(
  //   (report) => report.fileType !== ResoucrceType.PDF
  // );
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
