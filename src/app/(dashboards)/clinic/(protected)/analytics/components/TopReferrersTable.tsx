"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { TTopReferrer } from "@/types/referral-analytics";
import { formatDate } from "@/utils/formatDateTime";

interface TopReferrersTableProps {
  referrers: TTopReferrer[];
}

const HEADERS = [
  "Dentist",
  "GDC",
  "Practice",
  "Total",
  "Accepted",
  "Book Appointment",
  "Conversion %",
  "Last Referral",
];

export default function TopReferrersTable({ referrers }: TopReferrersTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow>
            {HEADERS.map((header, index) => (
              <TableHead
                key={header}
                className={`px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium ${
                  index === 0 ? "rounded-l-full" : ""
                } ${index === HEADERS.length - 1 ? "rounded-r-full" : ""}`}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrers.map((referrer) => (
            <TableRow
              key={referrer.gdc}
              className="bg-dashboardBackground hover:bg-gray text-lg text-dashboardTextBlack"
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {referrer.name}
              </TableCell>
              <TableCell className="px-6 py-4">{referrer.gdc}</TableCell>
              <TableCell className="px-6 py-4">
                {referrer.practice || "-"}
              </TableCell>
              <TableCell className="px-6 py-4">{referrer.total}</TableCell>
              <TableCell className="px-6 py-4">{referrer.accepted}</TableCell>
              <TableCell className="px-6 py-4">{referrer.converted}</TableCell>
              <TableCell className="px-6 py-4">
                {referrer.conversionRate}%
              </TableCell>
              <TableCell className="px-6 py-4 rounded-r-full">
                {formatDate(referrer.lastReferralAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
