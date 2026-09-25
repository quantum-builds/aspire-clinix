import { Skeleton } from "@/components/ui/skeleton";

export function SlotSelectionSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="text-left">
          <Skeleton className="mb-3 h-6 w-48 rounded" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 8 }).map((_, chipIndex) => (
              <Skeleton key={chipIndex} className="h-10 w-16 rounded-[100px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
