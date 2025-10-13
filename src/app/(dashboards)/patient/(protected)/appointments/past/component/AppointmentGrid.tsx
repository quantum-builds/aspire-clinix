import { AppointmentDateType, Response } from "@/types/common";
import PastAppointmentCard from "./PastAppointmentCard";
import { getAppointments } from "@/services/appointments/appointmentQuery";
import { TAppointment, TAppointmentResponse } from "@/types/appointment";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";

interface AppointmentGridWrapperProps {
  query: string;
  page: number;
  status: string;
  on: string;
  before: string;
  after: string;
}
interface AppointmentGridProps {
  appointments: TAppointment[];
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
    dateType: AppointmentDateType.PAST,
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
      </>
    );
  }

  const appointments = response.data.appointments;
  const total = response.data.pagination.totalPages;

  return (
    <>
      <AppointmentGrid appointments={appointments} />
      {total > 1 && <Pagination page={page} />}
    </>
  );
}

export function AppointmentGrid({ appointments }: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-4 bg-dashboardBarBackground rounded-2xl py-6 px-6">
      <p className="font-medium text-[22px]">Past Appointments</p>
      <div className="grid xl:grid-cols-2  grid-cols-1 gap-x-4 gap-y-4">
        {appointments.map((appointment, index) => (
          <PastAppointmentCard key={index} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
