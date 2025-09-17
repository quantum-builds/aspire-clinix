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
import { TReferralRequestDataTable } from "@/types/common";
import Image from "next/image";
import { CalenderInputIcon } from "@/assets";

interface ReferralRequestDataTableProps {
  entries: TReferralRequestDataTable[];
}

export function ReferralRequestDataTable({
  entries,
}: ReferralRequestDataTableProps) {
  return (
    <Table className="border-separate border-spacing-y-3">
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-l-full text-xl text-dashboardTextBlack font-medium">
            ID#
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Patient Name
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Referring Dentist
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Disease
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Referral Date
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-r-full text-xl text-dashboardTextBlack font-medium">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {entries.map((entry) => (
          <TableRow
            key={entry.id}
            className="bg-dashboardBackground text-lg text-dashboardTextBlack "
          >
            <TableCell className="px-6 py-4 rounded-l-full">
              {/* <div className="w-4 h-4 rounded bg-dashboardBackground group-hover:bg-green transition-colors" /> */}

              {entry.id}
            </TableCell>
            <TableCell className="px-6 py-4">{entry.patientName}</TableCell>
            <TableCell className="px-6 py-4">
              {entry.referringDentistName}
            </TableCell>
            <TableCell className="px-6 py-4">{entry.disease}</TableCell>
            <TableCell className="px-6 py-4 flex gap-1 items-center">
              <Image
                src={CalenderInputIcon}
                alt="calender input icon"
                className="w-5 h-5"
              />
              {entry.referralDate}
            </TableCell>
            <TableCell className="px-6 py-4 rounded-r-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => alert(`Viewing ${entry.id}`)}
                  >
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert(`Editing ${entry.id}`)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => alert(`Deleting ${entry.id}`)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
