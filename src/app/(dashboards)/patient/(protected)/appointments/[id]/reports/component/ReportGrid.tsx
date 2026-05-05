import { Response } from "@/types/common";
import DentistDetails from "./DentistDetails";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import { TReport } from "@/types/reports";
import { Dentist, TDentist } from "@/types/dentist";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { TAppointmentDetail } from "@/types/appointment";
import { getAppointment } from "@/services/appointments/appointmentQuery";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";

interface ResourceGridWrapperProps {
  query: string;
  appointmentId: string;
}

interface ReportGridProps {
  videoReports: TReport[];
  letterReports: TReport[];
  dentistDetails?: Dentist;
}

export default async function ReportGridWrapper({

  appointmentId,
}: ResourceGridWrapperProps) {
  const response: Response<TAppointmentDetail> = await getAppointment(appointmentId);


  if (
    !response.status ||
    (!response.data.reports.pdfs && !response.data.reports.videos) ||
    (response.data.reports.pdfs?.length === 0 &&
      response.data.reports.videos?.length === 0)
  ) {
    return <NoContent1 />;
  }

  const dentistDetails =
    response.data.reports.pdfs && response.data.reports.pdfs?.length > 0
      ? response.data.reports.pdfs[0].dentist
      : response.data.reports.videos && response.data.reports.videos?.length > 0
        ? response.data.reports.videos[0].dentist
        : undefined;
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
