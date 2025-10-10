"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BookAppointmentFormSkeleton() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="w-full flex justify-between items-center gap-3">
        <Skeleton className="h-[60px] w-52 rounded-full" /> {/* Cancel */}
        <Skeleton className="h-[60px] w-52 rounded-full" />{" "}
        {/* Book Appointment */}
      </div>
      {/* White box */}
      <div className="bg-dashboardBarBackground rounded-2xl p-6 space-y-10">
        {/* Title */}
        <Skeleton className="h-7 w-56 rounded-md" />

        {/* Dentist & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" /> {/* Label */}
            <Skeleton className="h-[52px] w-full rounded-2xl" />{" "}
            {/* Dentist dropdown */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" /> {/* Label */}
            <Skeleton className="h-[52px] w-full rounded-2xl" />{" "}
            {/* Email input */}
          </div>
        </div>

        {/* GDC & Branch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" /> {/* Label */}
            <Skeleton className="h-[52px] w-full rounded-2xl" />{" "}
            {/* GDC input */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" /> {/* Label */}
            <Skeleton className="h-[52px] w-full rounded-2xl" />{" "}
            {/* Branch dropdown */}
          </div>
        </div>

        {/* Date & Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" /> {/* Label */}
            <Skeleton className="h-[52px] w-full rounded-2xl" />{" "}
            {/* Date picker */}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" /> {/* Label */}
              <Skeleton className="h-[52px] w-full rounded-2xl" />{" "}
              {/* Start time */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" /> {/* Label */}
              <Skeleton className="h-[52px] w-full rounded-2xl" />{" "}
              {/* End time */}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-end items-center gap-3">
        <Skeleton className="h-[60px] w-32 rounded-full" /> {/* Cancel */}
        <Skeleton className="h-[60px] w-52 rounded-full" />{" "}
        {/* Book Appointment */}
      </div>
    </div>
  );
}
