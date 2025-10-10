"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { CalenderInputIconV2 } from "@/assets";
import { useRouter } from "next/navigation";
import { TReferralRequest } from "@/types/referral-request";
import { formatDate } from "@/utils/formatDateTime";
import { TableActionMenu } from "@/app/(dashboards)/components/custom-components/TableActionMenu";

interface ReferralRequestDataTableProps {
  entries: TReferralRequest[];
}

export function ReferralRequestDataTable({ entries }: ReferralRequestDataTableProps) {
  const router = useRouter();

  // You can expand this function later with more options (like "Assign Dentist", etc.)
  const getMenuOptions = (entry: TReferralRequest) => [
    {
      label: "View",
      onClick: () => router.push(`/dentist/referral-request/${entry.id}`),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto border-separate border-spacing-y-3 min-w-max">
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
              className="text-lg hover:bg-gray text-dashboardTextBlack cursor-pointer"
              onClick={() => router.push(`/dentist/referral-request/${entry.id}`)}
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {entry.id.slice(0, 8)}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.referralForm.patientName}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.referralForm.referralName}
              </TableCell>
              <TableCell className="px-6 py-4 flex gap-1 items-center">
                <Image
                  src={CalenderInputIconV2}
                  alt="calendar icon"
                  className="w-5 h-5"
                />
                {formatDate(entry.createdAt)}
              </TableCell>
              <TableCell className="px-6 py-4 rounded-r-full">
                <TableActionMenu options={getMenuOptions(entry)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
