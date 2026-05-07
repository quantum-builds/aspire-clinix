import PatientRDentistDetails from "./PatientDentistDetails";
import ClientReportGrid from "./ClientReportGrid";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { Patient, TPatient } from "@/types/patient";
import { Dentist, TDentist } from "@/types/dentist";
import { TAppointmentDetail } from "@/types/appointment";
import { getAppointment } from "@/services/appointments/appointmentQuery";
import {dropDown} from "";


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
    dentist: Dentist | undefined = undefined;

  const source = pdfs?.[0] || videos?.[0];

  if (source) {
    dentist = source.dentist;
  }
  patient = response.data.patient;

  return (
    <>
      <PatientRDentistDetails
        patientDetials={patient}
        dentistDetails={dentist}
      />
      <ClientReportGrid
        pdfs={pdfs}
        videos={videos}
        patient={patient}
        dentist={dentist}
      />
    </>
  );
}
