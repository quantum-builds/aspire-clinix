import { AppointmentDateType, Response } from "@/types/common";
import FirstUpcomingAppointmentCard from "./FirstUpcomingAppointmentCard";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";
import { TAppointment, TAppointmentResponse } from "@/types/appointment";
import { getAppointments } from "@/services/appointments/appointmentQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";

interface AppointmentGridWrapperProps {
  query: string;
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
  status,
  on,
  before,
  after,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    search: query,
    // dentistId: "cmfpmegmj0005l6qab0c10oil",
    patientId: "cmfplxicq0000l6qaof724vtk",
    dateType: AppointmentDateType.UPCOMING,
    status,on,before,after
  });

  if (
    !response.status ||
    !response.data ||
    !response.data.appointments ||
    response.data.appointments.length === 0
  ) {
    return (
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <NoContent1 />
    );
  }

  const appointments = response.data.appointments;

  return (
    <>
      <AppointmentGrid appointments={appointments} />
    </>
  );
}
export function AppointmentGrid({ appointments }: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-7">
      <FirstUpcomingAppointmentCard appointment={appointments[0]} />
      {appointments.length > 1 && (
        <div className="py-5 px-8 rounded-2xl bg-dashboardBarBackground space-y-5">
          <p className="font-medium text-[22px]">
            Next Appointment{appointments.length > 2 && "s"}
          </p>
          <div className="grid 1xl:grid-cols-2 gap-x-6 gap-y-10">
            {appointments.slice(1).map((appointment, index) => (
              <UpcomingAppointmentCard appointment={appointment} key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
