import { AppointmentDateType, Response } from "@/types/common";
import FirstUpcomingAppointmentCard from "./FirstUpcomingAppointmentCard";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";
import { TAppointment, TAppointmentResponse } from "@/types/appointment";
import { getAppointments } from "@/services/appointments/appointmentQuery";
import NoContent from "@/app/(dashboards)/components/NoContent";
import SearchBar from "@/app/(dashboards)/components/SearchBar";

interface AppointmentGridWrapperProps {
  query: string;
}
interface AppointmentGridProps {
  appointments: TAppointment[];
}

export default async function AppointmentGridWrapper({
  query,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    search: query,
    dentistId: "cmfpmegmj0005l6qab0c10oil",
    patientId: "cmfplxicq0000l6qaof724vtk",
    dateType: AppointmentDateType.UPCOMING,
  });

  console.log("reposne is ", response);
  if (
    !response.status ||
    !response.data ||
    !response.data.appointments ||
    response.data.appointments.length === 0
  ) {
    return (
      <NoContent title="Resources" placeholder="Enter Appointment Number" />
    );
  }

  const appointments = response.data.appointments;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointments</h1>
        <div>
          <SearchBar placeholder="Enter Appointment Number" />
        </div>
      </div>
      <AppointmentGrid appointments={appointments} />
    </>
  );
}
export function AppointmentGrid({ appointments }: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-7">
      <FirstUpcomingAppointmentCard appointment={appointments[0]} />
      {appointments.length > 1 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 p-6 border border-green rounded-2xl">
          {appointments.slice(1).map((appointment, index) => (
            <UpcomingAppointmentCard appointment={appointment} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
