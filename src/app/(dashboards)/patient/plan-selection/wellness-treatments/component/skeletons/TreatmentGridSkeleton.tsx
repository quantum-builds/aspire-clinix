import { Skeleton } from "@/components/ui/skeleton";

export function TreatmentCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] bg-[var(--wt-card)] px-8 py-9 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-10 w-2/3 rounded bg-white/10" />
        <Skeleton className="h-8 w-20 rounded bg-white/10" />
      </div>
      <Skeleton className="h-4 w-full rounded bg-white/10" />
      <Skeleton className="h-4 w-5/6 rounded bg-white/10" />
      <div className="mt-4 flex items-end justify-between">
        <Skeleton className="h-10 w-56 rounded bg-white/10" />
        <Skeleton className="h-9 w-[163px] rounded-full bg-white/10" />
      </div>
    </div>
  );
}

export function TreatmentGridSkeleton() {
  return (
    <div className="grid gap-6 text-left">
      {Array.from({ length: 2 }).map((_, index) => (
        <TreatmentCardSkeleton key={index} />
      ))}
    </div>
  );
}