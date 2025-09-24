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
import { Response, TAppointmentRequestCards } from "@/types/common";
import Image from "next/image";
import { CalenderInputIcon } from "@/assets";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import {
  TAppointmentRequest,
  TAppointmentRequestResponse,
} from "@/types/appointment-request";
import { getAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import {
  AttendedReferrals,
  AverageReferrals,
  CancelRequestIcon,
  TotalReferrals,
} from "@/assets";
import StatsCard from "@/app/(dashboards)/dentist/referral-request/components/StatsCard";
import { AppointmentRequestStatus } from "@prisma/client";

const REQUESTS_CARDS: TAppointmentRequestCards = {
  totalRequests: {
    icon: TotalReferrals,
    title: "Total Requests",
    count: 120,
    percentageChange: 100,
    link: "View all requests",
  },
  approvedRequest: {
    icon: AverageReferrals,
    title: "Approved Requests",
    count: 90,
    percentageChange: 75,
    link: "View approved",
  },
  pendingRequests: {
    icon: AttendedReferrals,
    title: "Pending Requests",
    count: 30,
    link: "View pending",
    percentageChange: -25,
  },
  cancelRequests: {
    icon: CancelRequestIcon,
    title: "Cancel Requests",
    count: 15,
    percentageChange: 12.5,
    link: "View cancel",
  },
};

interface RequestDataTableWrapperProps {
  query: string;
  page: number;
}

interface RequestsDataTable {
  entries: TAppointmentRequest[];
}

export default async function RequestDataTableWrapper({
  query,
  page,
}: RequestDataTableWrapperProps) {
  const response: Response<TAppointmentRequestResponse> =
    await getAppointmentRequests({
      search: query,
      patientId: "cmfplxicq0000l6qaof724vtk",
      page: page,
    });

  if (
    !response.status ||
    !response.data ||
    !response.data.appointmentRequests ||
    response.data.appointmentRequests.length === 0
  ) {
    return (
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <>
        <NoContent1 />
        <Pagination page={page} isLast={true} />
      </>
    );
  }
  const appointmentRequests = response.data.appointmentRequests;
  console.log("appointment requests are ", appointmentRequests);
  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {Object.entries(REQUESTS_CARDS).map(([key, card]) => (
          <StatsCard
            key={key}
            icon={card.icon}
            title={card.title}
            count={card.count}
            link={card.link}
            percentageChange={card.percentageChange}
          />
        ))}
      </div>
      <RequestsDataTable entries={appointmentRequests} />
      <Pagination page={page} />
    </>
  );
}

export function RequestsDataTable({ entries }: RequestsDataTable) {
  return (
    <Table className="border-separate border-spacing-y-3">
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-l-full text-xl text-dashboardTextBlack font-medium">
            Request #
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Reason
          </TableHead>{" "}
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Date Created
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Status
          </TableHead>
          <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
            Request Date
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
            <TableCell className="px-6 py-4">{entry.reason}</TableCell>
            <TableCell className="px-6 py-4 flex gap-1 items-center">
              <Image
                src={CalenderInputIcon}
                alt="calender input icon"
                className="w-5 h-5"
              />
              <span>{formatDate(entry.createdAt)}</span>
              <span>{formatTime(entry.createdAt)}</span>
            </TableCell>
            <TableCell className="px-6 py-4">
              <div className="flex gap-2 items-center">
                <div
                  className={`size-3 rounded-[4px] ${
                    entry.status === AppointmentRequestStatus.APPROVED
                      ? "bg-green"
                      : entry.status === AppointmentRequestStatus.PENDING
                      ? "bg-[#fcd833]"
                      : "bg-[#FF0000]"
                  }`}
                />
                {entry.status}
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 flex gap-1 items-center">
              <Image
                src={CalenderInputIcon}
                alt="calender input icon"
                className="w-5 h-5"
              />
              <span>{formatDate(entry.requestedDate)}</span>
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
