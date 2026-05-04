import { AppointmentDateType, Response } from "@/types/common";
import FirstUpcomingAppointmentCard from "./FirstUpcomingAppointmentCard";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";
import { TAppointment, TAppointmentResponse } from "@/types/appointment";
import { getAppointments } from "@/services/appointments/appointmentQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";

interface AppointmentGridWrapperProps {
  status: string;
  on: string;
  before: string;
  after: string;
}
interface AppointmentGridProps {
  appointments: TAppointment[];
}

export default async function AppointmentGridWrapper({
  status,
  on,
  before,
  after,
}: AppointmentGridWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    dateType: AppointmentDateType.UPCOMING,
    status,
    on,
    before,
    after,
  });

  console.log("Respinse in frontend ", response)

  if (
    !response.status ||
    !response.data ||
    !response.data.appointments ||
    response.data.appointments.length === 0
  ) {
    const text = !on.length && !before.length && !before.length ?
      "Select at least one appointment filter: ON, BEFORE, or AFTER." :
      "The data you have searched is not found at this moment"
    return (
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <NoContent1 text={text} />
    );
  }

  const appointments = response.data.appointments;
  console.log("appointment is ", appointments)

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
        <div className="py-5 px-8 rounded-2xl bg-dashboardBarBackground space-y-4">
          <p className="font-medium text-[22px]">
            Next Appointment{appointments.length > 2 && "s"}
          </p>
          <div className="grid 1xl:grid-cols-2 gap-x-4 gap-y-4">
            {appointments.slice(1).map((appointment, index) => (
              <UpcomingAppointmentCard appointment={appointment} key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
