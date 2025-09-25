import { TAppointmentDentist } from "@/types/common";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";

interface AppointmentGridProps {
  appointments: TAppointmentDentist[];
}
export default function AppointmentGrid({
  appointments,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="text-2xl font-medium">Upcoming Appointments</p>
      <div className="grid 1xl:grid-cols-2 gap-6">
        {appointments.map((appointment, index) => (
          <UpcomingAppointmentCard key={index} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
