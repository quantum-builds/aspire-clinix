"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportGridWrapperSkeleton() {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBackground">
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <div className="space-y-5">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-[200px] w-1/3 rounded-2xl" />
          </div>
        </div>

        <div className="space-y-5">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-[200px] w-1/3 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end items-center gap-3">
        <Skeleton className="h-[60px] w-[120px] rounded-full" />
        <Skeleton className="h-[60px] w-[160px] rounded-full" />
      </div>
    </div>
  )
}
