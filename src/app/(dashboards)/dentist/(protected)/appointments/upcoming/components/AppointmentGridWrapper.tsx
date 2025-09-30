import { getAppointments } from "@/services/appointments/appointmentQuery";
import { TAppointmentResponse } from "@/types/appointment";
import { AppointmentDateType, Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import AppointmentGrid from "./AppoinmentGrid";

interface AppointmentGridWrapperProps {
  query: string;
  page: number;
  status: string;
  on: string;
  before: string;
  after: string;
}

export default async function AppointmentGridWrapper({
  query,
  page,
  status,
  on,
  before,
  after,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    search: query,
    dateType: AppointmentDateType.UPCOMING,
    dentistId: "cmfpmcxf00003l6qa0rh5trss",
    page,
    status,
    on,
    before,
    after,
  });

  if (
    !response.status ||
    !response.data ||
    !response.data.appointments ||
    response.data.appointments.length === 0
  ) {
    return (
      <>
        <NoContent1 />
        <Pagination page={page} isLast={true} />
      </>
    );
  }

  const appointments = response.data.appointments;

  return (
    <>
      <AppointmentGrid appointments={appointments} />
      <Pagination page={page} />
    </>
  );
}
