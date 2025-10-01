import {
  getAppointment,
  getAppointments,
} from "@/services/appointments/appointmentQuery";
import { TAppointment, TAppointmentResponse } from "@/types/appointment";
import { AppointmentDateType, Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import ReportGrid from "./ReportGrid";
import Pagination from "@/app/(dashboards)/components/Pagination";

interface ReportGridGridWrapperProps {
  id: string;
}

export default async function ReportGridWrapper({
  id,
}: ReportGridGridWrapperProps) {
  const response: Response<TAppointment> = await getAppointment(id);

  console.log(response);
  if (!response.status || !response.data || !response.data) {
    return (
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <>
        <NoContent1 />
        <Pagination page={1} isLast={true} />
      </>
    );
  }

  return <ReportGrid appointment={response.data} />;
}
