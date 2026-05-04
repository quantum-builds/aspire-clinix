import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import PatientDetails from "./PatientDetails";
import { TReport} from "@/types/reports";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { Patient } from "@/types/patient";
import { TAppointmentDetail } from "@/types/appointment";
import { getAppointment } from "@/services/appointments/appointmentQuery";

interface ResourceGridWrapperProps {
  query: string;
  appointmentId: string;
}

interface ReportGridProps {
  videoReports: TReport[];
  letterReports: TReport[];
  patientDetails?: Patient | null;
  isNewUploadPage?: boolean;
}

export default async function ReportGridWrapper({
  appointmentId,
}: ResourceGridWrapperProps) {
  const response: Response<TAppointmentDetail> = await getAppointment(appointmentId);

  console.log("reposne is ", response)
  if (
    !response.status ||
    (!response.data.reports.pdfs && !response.data.reports.videos) ||
    (response.data.reports.pdfs?.length === 0 &&
      response.data.reports.videos?.length === 0)
  ) {
    return <NoContent1 />;
  }

  const pdfs = response.data.reports.pdfs;
  const videos = response.data.reports.videos;

  return (
    <>
      <ReportGrid
        videoReports={videos ?? []}
        letterReports={pdfs ?? []}
        patientDetails={response.data.patient}
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
  return (
    <div className="flex flex-col gap-7 bg-dashboardBackground">
      {patientDetails && <PatientDetails patientDetails={patientDetails} />}
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
