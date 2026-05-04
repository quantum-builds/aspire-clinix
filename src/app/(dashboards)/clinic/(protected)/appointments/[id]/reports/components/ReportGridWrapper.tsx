import PatientRDentistDetails from "./PatientDentistDetails";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { Patient, TPatient } from "@/types/patient";
import { TDentist } from "@/types/dentist";
import { TAppointmentDetail } from "@/types/appointment";
import { getAppointment } from "@/services/appointments/appointmentQuery";

interface ReportGridWrapperProps {
  id: string;
  title: string;
}
export default async function ReportGridWrapper({
  id,
}: ReportGridWrapperProps) {
  const response: Response<TAppointmentDetail> = await getAppointment(id);

  if (
    !response.status ||
    (!response.data.reports.pdfs && !response.data.reports.videos) ||
    (response.data.reports.pdfs?.length === 0 &&
      response.data.reports.videos?.length === 0)
  ) {
    // return <NoContent title="Reports" placeholder="Enter Report title" />;
    return <NoContent1 />;
  }

  const pdfs = response.data.reports.pdfs;
  const videos = response.data.reports.videos;

  let patient: Patient | null = null,
    dentist: TDentist | undefined = undefined;

  const source = pdfs?.[0] || videos?.[0];

  if (source) {
    dentist = source.dentist;
  }
  patient = response.data.patient

  return (
    <>
      <PatientRDentistDetails
        patientDetials={patient}
        dentistDetails={dentist}
      />
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGrid reports={videos ?? []} />
        <LetterReportGrid reports={pdfs ?? []} />
      </div>
    </>
  );
}
