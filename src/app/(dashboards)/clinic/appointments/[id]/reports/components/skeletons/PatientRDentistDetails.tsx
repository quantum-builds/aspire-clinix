import { Skeleton } from "@/components/ui/skeleton";

export default function PatientRDentistDetailsSkeleton() {
  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <Skeleton className="h-7 w-72" />

      <div className="grid grid-cols-2 gap-6">
        {/* Patient block */}
        <div className="bg-gray p-6 space-y-5 rounded-2xl">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-44" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Dentist block */}
        <div className="bg-gray p-6 space-y-5 rounded-2xl">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-5 w-64" />
        </div>
      </div>
    </div>
  );
}
