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
import Image from "next/image";
import { CalenderInputIcon, CalenderInputIconV2 } from "@/assets";
import { useRouter } from "next/navigation";
import { TReferralRequest } from "@/types/referral-request";
import { ReferralRequestStatus } from "@prisma/client";
import { formatDate } from "@/utils/formatDateTime";

interface ReferralHistoryDataTableProps {
  entries: TReferralRequest[];
}

export function ReferralHistoryDataTable({
  entries,
}: ReferralHistoryDataTableProps) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Reference #
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Patient Name
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Dentist Name
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Status
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
              className="bg-dashboardBackground hover:bg-gray cursor-pointer text-lg text-dashboardTextBlack"
              onClick={() =>
                router.push(`/dentist/referral-history/${entry.id}`)
              }
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {entry.id.slice(0, 8)}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.referralForm.patientName}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.assignedDentist
                  ? entry.assignedDentist.fullName
                  : "-----"}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex gap-2 items-center">
                  <div
                    className={`size-3 rounded-[4px] ${
                      entry.requestStatus === ReferralRequestStatus.ASSIGNED
                        ? "bg-green"
                        : "bg-[#fcd833]"
                    }`}
                  />
                  {entry.requestStatus}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 flex gap-1 items-center">
                <Image
                  src={CalenderInputIconV2}
                  alt="calender input icon"
                  className="w-5 h-5"
                />
                {formatDate(entry.createdAt)}
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
    </div>
  );
}
