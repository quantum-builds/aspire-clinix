"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { TDentist } from "@/types/dentist";

interface RequestsDataTable {
  entries: TDentist[];
}

export function PracticeDentistDataTable({ entries }: RequestsDataTable) {
  return (
    <div className="w-full overflow-x-auto bg-dashboardBarBackground rounded-2xl px-4 pb-4 pt-4 tracking-tightest">
      <Table className="border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow className="bg-dashboardBackground">
            <TableHead className="px-6 py-4 rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Dentist Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Dentist Email
            </TableHead>
            <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
              Dentist Phone
            </TableHead>
            <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
              GDC No.
            </TableHead>
            <TableHead className="px-6 py-4  rounded-r-full text-xl text-dashboardTextBlack font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className="text-lg hover:bg-gray text-dashboardTextBlack cursor-pointer"
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {entry.fullName}
              </TableCell>
              <TableCell className="px-6 py-4">{entry.email}</TableCell>
              <TableCell className="px-6 py-4 flex gap-1 items-center">
                {entry.phoneNumber}
              </TableCell>
              <TableCell className="px-6 py-4">{entry.gdcNo}</TableCell>

              <TableCell className="px-6 py-4 rounded-r-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
