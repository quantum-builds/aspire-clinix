import { TPastAppointmentPatient } from "@/types/common";
import PastAppointmentCard from "./PastAppointmentCard";

interface AppointmentGridProps {
  appointments: TPastAppointmentPatient[];
}
export default function AppointmentGrid({
  appointments,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="font-medium text-2xl">Past Appointments</p>
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">
        {appointments.map((appointment, index) => (
          <PastAppointmentCard key={index} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
