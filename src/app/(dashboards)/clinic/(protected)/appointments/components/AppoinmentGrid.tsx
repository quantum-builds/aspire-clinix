import { AppointmentDateType } from "@/types/common";
import AppointmentCard from "./AppointmentCard";
import { TAppointment } from "@/types/appointment";
interface AppointmentGridProps {
  appointments: TAppointment[];
  type: AppointmentDateType;
}
export default function AppointmentGrid({
  appointments,
  type,
}: AppointmentGridProps) {
  return (
    <div className="flex flex-col gap-6 bg-dashboardBarBackground rounded-2xl py-6 px-8">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-medium">
          {type === AppointmentDateType.UPCOMING ? "Upcoming" : "Past"}{" "}
          Appointments
        </p>
        {type === AppointmentDateType.UPCOMING && (
          <p className="text-xl text-green italic">
            {appointments.length} new appointment
            {appointments.length > 1 && "s"}
          </p>
        )}
      </div>
      <div className="grid 1xl:grid-cols-2 gap-x-4 gap-y-4">
        {appointments.map((appointment, index) => (
          <AppointmentCard key={index} appointment={appointment} type={type} />
        ))}
      </div>
    </div>
  );
}
