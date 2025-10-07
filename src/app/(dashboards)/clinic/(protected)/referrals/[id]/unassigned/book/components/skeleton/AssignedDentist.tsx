import { Skeleton } from "@/components/ui/skeleton"

export default function AssignDentistFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* White form card */}
      <div className="bg-white rounded-2xl px-6 py-8 space-y-6">
        <div>
          <Skeleton className="h-7 w-64" />
        </div>

        {/* Branch and Dentist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[52px] w-full rounded-2xl" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[52px] w-full rounded-2xl" />
          </div>
        </div>

        {/* GDC and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[52px] w-full rounded-2xl" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[52px] w-full rounded-2xl" />
          </div>
        </div>

        {/* Appointment Date, Start, End time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[52px] w-full rounded-2xl" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-[52px] w-full rounded-2xl" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-[52px] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full flex justify-end items-center gap-3">
        <Skeleton className="h-[60px] w-32 rounded-full" />
        <Skeleton className="h-[60px] w-48 rounded-full" />
      </div>
    </div>
  )
}
