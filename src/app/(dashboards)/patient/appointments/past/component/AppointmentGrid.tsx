import { AppointmentDateType, Response } from "@/types/common";
import PastAppointmentCard from "./PastAppointmentCard";
import { getAppointments } from "@/services/appointments/appointmentQuery";
import { TAppointment, TAppointmentResponse } from "@/types/appointment";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";

interface AppointmentGridWrapperProps {
  query: string;
  page: number;
}
interface AppointmentGridProps {
  appointments: TAppointment[];
}

export default async function AppointmentGridWrapper({
  query,
  page,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    search: query,
    // dentistId: "cmfpmegmj0005l6qab0c10oil",
    patientId: "cmfplxicq0000l6qaof724vtk",
    dateType: AppointmentDateType.PAST,
    page: page,
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

export function AppointmentGrid({ appointments }: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="font-medium text-2xl">Past Appointments</p>
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-x-6 gap-y-10">
        {appointments.map((appointment, index) => (
          <PastAppointmentCard key={index} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
