"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ReferralHistoryDetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col gap-5">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-16 w-32" />
        </div>
      </div>

      {/* Patient, Dentist, Referral Details Skeleton */}
      <div className="bg-white w-full rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray p-6 rounded-2xl space-y-4">
              <Skeleton className="h-7 w-56" />
              <div className="flex flex-col gap-3">
                <div className="flex gap-5">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-5 w-56" />
                </div>
                <div className="flex gap-5">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-5 w-56" />
                </div>
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Skeleton */}
      <div className="bg-white rounded-2xl p-6 space-y-10 ">
        <Skeleton className="h-8 w-48" />
        <div className="border border-green rounded-2xl p-6 space-y-6 lg50:w-3/4 1xl:w-2/3 2xl:w-1/2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-40" />
            <div className="flex gap-4 items-center">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-44" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-56" />
          </div>
          <div className="flex justify-between items-center pt-3">
            <Skeleton className="h-10 w-40 rounded-xl" />
            <Skeleton className="h-5 w-56" />
          </div>
        </div>
      </div>
    </div>
  )
}
