"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { TLoyaltyPointsDataTable } from "@/types/common";
import Image from "next/image";
import { CalenderInputIcon } from "@/assets";
import { useRouter } from "next/navigation";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";

interface LoyaltyPointsDataTableProps {
  entries: TLoyaltyPointsDataTable[];
}

export function LoyaltyPointsDataTable({
  entries,
}: LoyaltyPointsDataTableProps) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto">
      <Table className="border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow className="bg-dashboardBackground">
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
              Earned Points
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Other Points
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
              key={entry.referenceId}
              className="text-lg hover:bg-gray text-dashboardTextBlack cursor-pointer"
              onClick={() =>
                router.push(`/dentist/loyalty-points/${entry.referenceId}`)
              }
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {entry.referenceId}
              </TableCell>
              <TableCell className="px-6 py-4">{entry.patientName}</TableCell>
              <TableCell className="px-6 py-4">{entry.dentistName}</TableCell>
              <TableCell className="px-6 py-4">{entry.earnedPoints}</TableCell>
              <TableCell className="px-6 py-4">{entry.otherPoints}</TableCell>
              <TableCell className="px-6 py-4 flex gap-1 items-center">
                <Image
                  src={CalenderInputIcon}
                  alt="calender input icon"
                  className="w-5 h-5"
                />
                {entry.referralDate}
              </TableCell>
              <TableCell className="px-6 py-4 rounded-r-full">
                <Dropdown
                  options={[
                    { value: "view", label: "View" },
                    { value: "edit", label: "Edit" },
                    { value: "delete", label: "Delete" },
                  ]}
                  value=""
                  onValueChange={(action) => {
                    if (!action) return
                    if (action === "view") alert(`Viewing ${entry.referenceId}`)
                    else if (action === "edit") alert(`Editing ${entry.referenceId}`)
                    else if (action === "delete") alert(`Deleting ${entry.referenceId}`)
                  }}
                  placeholder=""
                  showClearOption={false}
                  customTrigger={
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                  }
                />
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
