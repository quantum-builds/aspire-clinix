import { getAppointments } from "@/services/appointments/appointmentQuery";
import { TAppointmentResponse } from "@/types/appointment";
import { AppointmentDateType, Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import AppointmentGrid from "./AppointmentGrid";

interface AppointmentGridWrapperProps {
  query: string;
  page: number;
}

export default async function AppointmentGridWrapper({
  query,
  page,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    search: query,
    dateType: AppointmentDateType.PAST,
  });

  if (
    !response.status ||
    !response.data ||
    !response.data.appointments ||
    response.data.appointments.length === 0
  ) {
    return (
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
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
