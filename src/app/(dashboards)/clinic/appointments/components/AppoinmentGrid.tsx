import { TAppointmentClinic } from "@/types/common";
import AppointmentCard from "./AppointmentCard";

interface AppointmentGridProps {
  appointments: TAppointmentClinic[];
  type: "past" | "upcoming";
}
export default function AppointmentGrid({
  appointments,
  type,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-medium">
          {type === "upcoming" ? "Upcoming" : "Past"} Appointments
        </p>
        {type === "upcoming" && (
          <p className="text-xl text-green italic">
            {appointments.length} new appointment
            {appointments.length > 1 && "s"}
          </p>
        )}
      </div>
      <div className={`grid xl:grid-cols-2 gap-6`}>
        {appointments.map((appointment, index) => (
          <AppointmentCard key={index} appointment={appointment} type={type} />
        ))}
      </div>
    </div>
  );
}
