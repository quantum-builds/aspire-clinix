import { getAppointments } from "@/services/appointments/appointmentQuery";
import { TAppointmentResponse } from "@/types/appointment";
import { AppointmentDateType, Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import AppointmentGrid from "../../components/AppoinmentGrid";

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
  after,
  before,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    search: query,
    dateType: AppointmentDateType.PAST,
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
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <>
        <NoContent1 />
        {/* <Pagination page={page} isLast={true} /> */}
      </>
    );
  }

  const appointments = response.data.appointments;

  const total = response.data.pagination.totalPages;

  return (
    <>
      <AppointmentGrid
        appointments={appointments}
        type={AppointmentDateType.PAST}
      />
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
