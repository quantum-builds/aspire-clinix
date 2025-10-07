import { Skeleton } from "@/components/ui/skeleton"

export default function UnAssignedPatientDetailsSkeleton() {
  return (
    <div className="min-h-screen flex flex-col gap-5">
      {/* Top bar skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Patient skeleton */}
        <div className="bg-gray p-6 rounded-2xl space-y-5">
          <Skeleton className="h-8 w-48" />
          <div className="flex flex-col 1xl50:flex-row 1xl50:items-center gap-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex flex-col 1xl50:flex-row 1xl50:items-center gap-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Referral dentist skeleton */}
        <div className="bg-gray p-6 rounded-2xl space-y-5">
          <Skeleton className="h-8 w-56" />
          <div className="flex flex-col 1xl50:flex-row 1xl50:items-center gap-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex flex-col 1xl50:flex-row 1xl50:items-center gap-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    </div>
  )
}
