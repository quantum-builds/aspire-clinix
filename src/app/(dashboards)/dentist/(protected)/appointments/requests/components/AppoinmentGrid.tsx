import UpcomingAppointmentCard from "./RequestAppointmentCard";
import { TAppointment } from "@/types/appointment";

interface AppointmentGridProps {
  appointments: TAppointment[];
}
export default function AppointmentGrid({
  appointments,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-4 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="text-[22px] font-medium">Request Appointments</p>
      <div className="grid 1xl:grid-cols-2 gap-4">
        {appointments.map((appointment, index) => (
          <UpcomingAppointmentCard key={index} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
