import { Skeleton } from "@/components/ui/skeleton";

export default function LetterReportGridSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <Skeleton className="h-7 w-44" />
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-x-6 gap-y-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-4 space-y-4"
          >
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
