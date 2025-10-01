"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PracticeDetailsSkeleton() {
  return (
    <div className="bg-dashboardBarBackground rounded-2xl p-5 space-y-6 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-5 w-36" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>

        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-64 xl:col-span-3" />
      </div>
    </div>
  );
}
