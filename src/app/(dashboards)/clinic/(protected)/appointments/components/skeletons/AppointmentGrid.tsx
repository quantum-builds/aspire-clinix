import AppointmentCardSkeleton from "./AppointmentCard";

interface AppointmentGridSkeletonProps {
  count?: number;
  type: "UPCOMING" | "PAST";
}

export default function AppointmentGridSkeleton({
  count = 4,
  type,
}: AppointmentGridSkeletonProps) {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-medium">
          {type === "UPCOMING" ? "Upcoming" : "Past"} Appointments
        </p>
        {type === "UPCOMING" && (
          <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
        )}
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <AppointmentCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
