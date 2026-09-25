import { Skeleton } from "@/components/ui/skeleton";

export function PractitionerCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-green px-5 py-6 bg-dashboardBarBackground">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-7 w-2/3 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <Skeleton className="h-4 w-1/4 rounded" />
      <Skeleton className="mt-2 h-10 w-36 rounded-[100px]" />
    </div>
  );
}

export function PractitionerGridSkeleton() {
  return (
    <div className="grid gap-5 text-left">
      {Array.from({ length: 6 }).map((_, index) => (
        <PractitionerCardSkeleton key={index} />
      ))}
    </div>
  );
}
