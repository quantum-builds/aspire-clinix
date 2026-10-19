"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function TreatmentTableSkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <TableBody>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i} className="bg-dashboardBarBackground text-lg">
          <TableCell className="px-6 py-4 rounded-l-full">
            <Skeleton className="h-5 w-32 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-40 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-16 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-12 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-16 rounded-md" />
          </TableCell>
          <TableCell className="px-6 py-4 rounded-r-full">
            <Skeleton className="h-5 w-12 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

const treatmentHeaderNames = [
  "Name",
  "Description",
  "Price",
  "Slots",
  "Status",
  "Actions",
];

export function TreatmentDataTableSkeleton() {
  return (
    <Table className="border-separate border-spacing-y-3 mt-6 bg-dashboardBarBackground px-6 rounded-2xl">
      <TableHeader>
        <TableRow>
          {treatmentHeaderNames.map((header, i) => (
            <TableHead
              key={i}
              className={`px-6 py-4 bg-dashboardBackground text-xl text-dashboardTextBlack font-medium ${
                i === 0
                  ? "rounded-l-full"
                  : i === treatmentHeaderNames.length - 1
                  ? "rounded-r-full"
                  : ""
              } `}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TreatmentTableSkeletonRows />
    </Table>
  );
}
