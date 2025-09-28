import AppointmentRequestCardSkeleton from "./AppointmentRequestCard";

interface AppointmentRequestGridSkeletonProps {
  count?: number;
}

export default function AppointmentRequestGridSkeleton({
  count = 4,
}: AppointmentRequestGridSkeletonProps) {
  return (
    <div className="bg-dashboardBarBackground p-6 rounded-2xl space-y-10">
      <div className="h-6 w-48 rounded bg-dashboardTextBlack animate-pulse" />
      <div className="grid 1xl50:grid-cols-2 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <AppointmentRequestCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
