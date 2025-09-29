import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingAppointmentCardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBarBackground">
      {/* Header */}
      <div className="flex justify-between">
        <Skeleton className="h-6 w-48 rounded" />
        <div className="flex flex-col gap-3 items-end">
          <div className="flex gap-3">
            <Skeleton className="h-5 w-28 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
          <Skeleton className="h-5 w-36 rounded" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5">
        <Skeleton className="h-6 w-40 rounded" />
        <div className="grid grid-cols-2 gap-y-5 gap-x-5">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-full rounded" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-5 w-60 rounded" />
      </div>
    </div>
  );
}
