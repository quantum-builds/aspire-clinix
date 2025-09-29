import { PastAppointmentCardSkeleton } from "./PastAppointmentCard";

export function AppointmentGridSkeleton() {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBarBackground rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-dashboardBackground rounded"></div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10">
        <PastAppointmentCardSkeleton />
        <PastAppointmentCardSkeleton />
        <PastAppointmentCardSkeleton />
        <PastAppointmentCardSkeleton />
      </div>
    </div>
  );
}
