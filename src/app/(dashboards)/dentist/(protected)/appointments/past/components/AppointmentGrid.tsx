import PastAppointmentCard from "./PastAppointmentCard";
import { TAppointment } from "@/types/appointment";

interface AppointmentGridProps {
  appointments: TAppointment[];
}
export default function AppointmentGrid({
  appointments,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="text-2xl font-medium">Past Appointments</p>
      <div className="grid xl:grid-cols-2 gap-6">
        {appointments.map((appointment, index) => (
          <PastAppointmentCard appointment={appointment} key={index} />
        ))}
      </div>
    </div>
  );
}
