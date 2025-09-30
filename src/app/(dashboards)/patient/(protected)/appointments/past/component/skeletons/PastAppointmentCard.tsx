import { Skeleton } from "@/components/ui/skeleton";

export function PastAppointmentCardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-10 rounded-2xl bg-dashboardBackground">
      {/* Header */}
      <div className="flex justify-between gap-3 items-center">
        <Skeleton className="h-5 w-32 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>

      {/* Dentist Details */}
      <div className="flex flex-wrap gap-y-5 justify-between">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
        <Skeleton className="h-5 w-36 rounded" />
        <Skeleton className="h-5 w-44 rounded" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-5 w-36 rounded" />
      </div>
    </div>
  );
}
