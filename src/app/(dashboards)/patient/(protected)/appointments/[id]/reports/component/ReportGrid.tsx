import { Response } from "@/types/common";
import DentistDetails from "./DentistDetails";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import { TReport, TReportResponse } from "@/types/reports";
import { getReports } from "@/services/reports/reportsQuery";
import { TDentist } from "@/types/dentist";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";

interface ResourceGridWrapperProps {
  query: string;
  appointmentId: string;
  // dentistDetails: TDentistDeatils;
}

interface ReportGridProps {
  videoReports: TReport[];
  letterReports: TReport[];
  dentistDetails?: TDentist;
}

export default async function ReportGridWrapper({
  query,
  appointmentId,
}: // dentistDetails,
ResourceGridWrapperProps) {
  const response: Response<TReportResponse> = await getReports({
    search: query,
    // dentistId: "cmfpmegmj0005l6qab0c10oil",
    // patientId: "cmfplxicq0000l6qaof724vtk",
    appointmentId: appointmentId,
  });

  if (
    !response.status ||
    (!response.data.reports.pdfs && !response.data.reports.videos) ||
    (response.data.reports.pdfs?.length === 0 &&
      response.data.reports.videos?.length === 0)
  ) {
    // return <NoContent title="Reports" placeholder="Enter Report title" />;
    return <NoContent1 />;
  }

  const dentistDetails = response.data.dentist;
  const pdfs = response.data.reports.pdfs;
  const videos = response.data.reports.videos;

  return (
    <>
      <ReportGrid
        videoReports={videos ?? []}
        letterReports={pdfs ?? []}
        dentistDetails={dentistDetails}
      />
    </>
  );
}

export function ReportGrid({
  videoReports,
  letterReports,
  dentistDetails,
}: ReportGridProps) {
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
