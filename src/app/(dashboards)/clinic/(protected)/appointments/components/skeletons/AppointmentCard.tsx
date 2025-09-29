import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-dashboardBackground p-6 shadow-sm">
      <Skeleton className="h-6 w-1/3 rounded" />
      <div className="grid grid-cols-2 gap-5">
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
      <Skeleton className="h-10 w-20 rounded mt-4" />
    </div>
  );
}
