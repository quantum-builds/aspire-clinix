import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentRequestCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl p-6 space-y-10 bg-dashboardBackground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 rounded" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>

      {/* Patient info */}
      <div className="flex">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-5 w-36 rounded" />
        </div>
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>

      {/* Appointment date & reason */}
      <div className="flex">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-5 w-40 rounded" />
        </div>
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-5 w-52 rounded" />
        </div>
      </div>

      {/* Note */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-5 w-64 rounded" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-10 w-40 rounded" />
      </div>
    </div>
  );
}
