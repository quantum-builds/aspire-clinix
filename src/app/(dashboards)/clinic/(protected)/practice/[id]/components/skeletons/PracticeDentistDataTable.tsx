"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function PracticeDentistDataTableSkeleton() {
  // Number of placeholder rows
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="w-full overflow-x-auto bg-dashboardBarBackground rounded-2xl px-4 pb-4 pt-4 tracking-tightest">
      <Table className="border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow className="bg-dashboardBackground">
            <TableHead className="px-6 py-4 rounded-l-full text-xl font-medium">
              Dentist Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xl font-medium">
              Dentist Email
            </TableHead>
            <TableHead className="px-6 py-4 text-xl font-medium">
              Dentist Phone
            </TableHead>
            <TableHead className="px-6 py-4 text-xl font-medium">
              GDC No.
            </TableHead>
            <TableHead className="px-6 py-4 rounded-r-full text-xl font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {skeletonRows.map((_, i) => (
            <TableRow key={i} className="hover:bg-gray">
              <TableCell className="px-6 py-4 rounded-l-full">
                <Skeleton className="h-5 w-32 rounded-md" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <Skeleton className="h-5 w-40 rounded-md" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <Skeleton className="h-5 w-28 rounded-md" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <Skeleton className="h-5 w-20 rounded-md" />
              </TableCell>
              <TableCell className="px-6 py-4 rounded-r-full flex justify-center">
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
