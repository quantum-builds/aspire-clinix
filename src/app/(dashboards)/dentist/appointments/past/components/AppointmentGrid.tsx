import { TAppointmentDentist } from "@/types/common";
import PastAppointmentCard from "./PastAppointmentCard";

interface AppointmentGridProps {
  appointments: TAppointmentDentist[];
}
export default function AppointmentGrid({
  appointments,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="text-2xl font-medium">Past Appointments</p>
      <div className="grid grid-cols-2 gap-6">
        {appointments.map((appointment, index) => (
          <PastAppointmentCard appointment={appointment} key={index} />
        ))}
      </div>
    </div>
  );
}
