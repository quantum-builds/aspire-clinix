import { Skeleton } from "@/components/ui/skeleton";

export function PractitionerCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/5 bg-[var(--wt-card)] px-6 py-8 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] sm:px-8 sm:py-9">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-10 w-2/3 rounded bg-white/10" />
        <Skeleton className="h-5 w-20 rounded bg-white/10" />
      </div>
      <Skeleton className="h-4 w-1/4 rounded bg-white/10" />
      <div className="mt-4 flex justify-end">
        <Skeleton className="h-9 w-[163.5px] rounded-full bg-white/10" />
      </div>
    </div>
  );
}

export function PractitionerGridSkeleton() {
  return (
    <div className="grid gap-6 text-left">
      {Array.from({ length: 3 }).map((_, index) => (
        <PractitionerCardSkeleton key={index} />
      ))}
    </div>
  );
}