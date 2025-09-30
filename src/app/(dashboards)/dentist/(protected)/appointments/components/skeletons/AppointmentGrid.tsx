import AppointmentCardSkeleton from "./AppointmentCard";

interface AppointmentGridSkeletonProps {
  count?: number;
}

export default function AppointmentGridSkeleton({
  count = 4,
}: AppointmentGridSkeletonProps) {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <div className="h-7 w-48 rounded bg-gray-300 animate-pulse" />
      <div className="grid xl:grid-cols-2 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <AppointmentCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
