import { FirstUpcomingAppointmentCardSkeleton } from "./FirstUpcomingAppointmentCard";
import { UpcomingAppointmentCardSkeleton } from "./UpcomingAppointmentCard";

export function AppointmentGridSkeleton() {
  return (
    <div className="flex flex-col gap-7">
      <FirstUpcomingAppointmentCardSkeleton />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 p-6 border border-green rounded-2xl">
        <UpcomingAppointmentCardSkeleton />
        <UpcomingAppointmentCardSkeleton />
      </div>
    </div>
  );
}
