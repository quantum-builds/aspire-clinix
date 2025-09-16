import { TUpcomingAppointmentPatient } from "@/types/common";
import FirstUpcomingAppointmentCard from "./FirstUpcomingAppointmentCard";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";

interface AppointmentGridProps {
  appointments: TUpcomingAppointmentPatient[];
}
export default function AppointmentGrid({
  appointments,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-7">
      <FirstUpcomingAppointmentCard appointment={appointments[0]} />
      {appointments.length > 1 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 p-6 border border-green rounded-2xl">
          {appointments.slice(1).map((appointment) => (
            <UpcomingAppointmentCard appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
