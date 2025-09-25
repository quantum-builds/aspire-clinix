"use client";

import { Skeleton } from "@/components/ui/skeleton"; // if you already have one, otherwise create it
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function StatsCardSkeleton() {
  return (
    <div className="max-w-[360px] py-5 px-6 space-y-5 rounded-2xl bg-white animate-pulse">
      <div className="flex justify-between items-start">
        <Skeleton className="size-12 rounded-xl" />
        <Skeleton className="h-5 w-10 rounded-md" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-5 w-8 rounded-md" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function RequestTableSkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <TableBody>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i} className="bg-dashboardBackground text-lg">
          <TableCell className="px-6 py-4 rounded-l-full">
            <Skeleton className="h-5 w-24 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-32 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-28 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-20 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-28 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4 rounded-r-full">
            <Skeleton className="h-5 w-12 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export function RequestDataTableSkeleton() {
  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <Table className="border-separate border-spacing-y-3 mt-6">
        <TableHeader>
          <TableRow>
            {[
              "Request #",
              "Reason",
              "Date Created",
              "Status",
              "Request Date",
              "Actions",
            ].map((header, i) => (
              <TableHead
                key={i}
                className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <RequestTableSkeletonRows />
      </Table>
    </>
  );
}
