import {
  getAppointment,
} from "@/services/appointments/appointmentQuery";
import { TAppointmentDetail } from "@/types/appointment";
import {  Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import ReportGrid from "./ReportGrid";

interface ReportGridGridWrapperProps {
  id: string;
}

export default async function ReportGridWrapper({
  id,
}: ReportGridGridWrapperProps) {
  const response: Response<TAppointmentDetail> = await getAppointment(id);


  if (!response.status || !response.data) {
    return (
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <>
        <NoContent1 />
      </>
    );
  }

  return <ReportGrid appointment={response.data.appointment} videoReports={response.data.reports.videos} pdfReports={response.data.reports.pdfs}/>;
}
