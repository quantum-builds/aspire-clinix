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

const headerNames = [
  "Request #",
  "Reason",
  "Date Created",
  "Status",
  "Request Date",
  "Actions",
];
export function RequestDataTableSkeleton() {
  return (
    <>
      <Table className="border-separate border-spacing-y-3 mt-6">
        <TableHeader>
          <TableRow>
            {headerNames.map((header, i) => (
              <TableHead
                key={i}
                className={`px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium ${
                  i === 0
                    ? "rounded-l-full"
                    : i === headerNames.length - 1
                    ? "rounded-r-full"
                    : ""
                } `}
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
