import { Skeleton } from "@/components/ui/skeleton";

export default function VideoReportGridSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <Skeleton className="h-7 w-40" />
      <div className="grid 1xl:grid-cols-3 lg:grid-cols-2 gap-x-6 gap-y-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-4 space-y-4"
          >
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
