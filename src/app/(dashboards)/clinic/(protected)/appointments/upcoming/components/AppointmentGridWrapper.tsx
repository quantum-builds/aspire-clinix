import { getAppointments } from "@/services/appointments/appointmentQuery";
import { TAppointmentResponse } from "@/types/appointment";
import { AppointmentDateType, Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import AppointmentGrid from "../../components/AppoinmentGrid";

interface AppointmentGridWrapperProps {
  page: number;
  status: string;
  on: string;
  before: string;
  after: string;
}

export default async function AppointmentGridWrapper({
  page,
  status,
  on,
  before,
  after,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    dateType: AppointmentDateType.UPCOMING,
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
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <>
        <NoContent1 />
        {/* <Pagination page={page} isLast={true} /> */}
      </>
    );
  }

  const appointments = response.data.appointments;

  const total = response.data.meta.totalPages;
  console.log("reposnse ", response.data)

  return (
    <>
      <AppointmentGrid
        appointments={appointments}
        type={AppointmentDateType.UPCOMING}
      />
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
