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
import { TReferralHistoryDataTable } from "@/types/common";
import Image from "next/image";
import { CalenderInputIconV2 } from "@/assets";
import { useRouter } from "next/navigation";

interface ReferralHistoryDataTableProps {
  entries: TReferralHistoryDataTable[];
}

export function ReferralHistoryDataTable({
  entries,
}: ReferralHistoryDataTableProps) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto bg-dashboardBarBackground rounded-2xl px-4 pb-4 pt-4 tracking-tightest">
      <Table className="table-auto border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow className="bg-dashboardBackground">
            <TableHead className="px-6 py-4 rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Reference #
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Patient Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Disease
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Referral Date
            </TableHead>
            <TableHead className="px-6 py-4 rounded-r-full text-xl text-dashboardTextBlack font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.referenceId}
              className="text-lg hover:bg-gray text-dashboardTextBlack cursor-pointer"
              onClick={() =>
                router.push(`/dentist/referral-history/${entry.referenceId}`)
              }
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                REF # {entry.referenceId}
              </TableCell>
              <TableCell className="px-6 py-4">{entry.patientName}</TableCell>
              <TableCell className="px-6 py-4">{entry.disease}</TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex gap-2 items-center">
                  <div
                    className={`size-3 rounded-[4px] ${
                      entry.status === "Assigned" ? "bg-green" : "bg-[#fcd833]"
                    }`}
                  />
                  {entry.status}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 flex gap-1 items-center">
                <Image
                  src={CalenderInputIconV2}
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
                      onClick={() => alert(`Viewing ${entry.referenceId}`)}
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert(`Editing ${entry.referenceId}`)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => alert(`Deleting ${entry.referenceId}`)}
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
    </div>
  );
}
