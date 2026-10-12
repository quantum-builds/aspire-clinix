import { Skeleton } from "@/components/ui/skeleton";

export function PlanSelectionSkeleton() {
  return (
    <div className="mx-auto mt-12 grid max-w-[650px] gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-[28px] border border-white/5 bg-[var(--wt-card)] px-6 py-7 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] sm:px-8 sm:py-8"
        >
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-9 w-2/3 rounded bg-white/10" />
            <Skeleton className="h-6 w-6 rounded bg-white/10" />
          </div>
          <Skeleton className="h-5 w-full rounded bg-white/10" />
          <Skeleton className="h-5 w-5/6 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}
