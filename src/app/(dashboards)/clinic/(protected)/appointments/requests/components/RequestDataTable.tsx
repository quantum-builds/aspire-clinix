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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { CalenderInputIconV2 } from "@/assets";
import { formatDate } from "@/utils/formatDateTime";
import { TAppointmentRequest } from "@/types/appointment-request";
import { AppointmentRequestStatus } from "@prisma/client";
import RequestDetailsModal from "./RequestDetailsModal";
import { useState } from "react";

interface RequestsDataTable {
  entries: TAppointmentRequest[];
}

export function RequestsDataTable({ entries }: RequestsDataTable) {
  const [selectedRequest, setSelectedRequest] =
    useState<TAppointmentRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (request: TAppointmentRequest) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  return (
    <>
      <div className="w-full overflow-x-auto bg-dashboardBarBackground rounded-2xl px-4 pb-4 pt-4">
        <Table className="border-separate border-spacing-y-3 min-w-max">
          <TableHeader>
            <TableRow className="bg-dashboardBackground">
              <TableHead className="px-6 py-4 rounded-l-full text-xl text-dashboardTextBlack font-medium">
                Patient Name
              </TableHead>
              <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
                Patient Email
              </TableHead>
              <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
                Patient Phone
              </TableHead>
              <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
                Status
              </TableHead>
              <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
                Request Date
              </TableHead>
              <TableHead className="px-6 py-4  rounded-r-full text-xl text-dashboardTextBlack font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {entries.map((entry) => (
              <TableRow
                onClick={() => handleRowClick(entry)}
                key={entry.id}
                className="text-lg hover:bg-gray text-dashboardTextBlack cursor-pointer"
              >
                <TableCell className="px-6 py-4 rounded-l-full">
                  {entry.patient?.fullName}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {entry.patient?.email}
                </TableCell>
                <TableCell className="px-6 py-4 flex gap-1 items-center">
                  {entry.patient?.phoneNumber}
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
                    src={CalenderInputIconV2}
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
                      {/* <DropdownMenuItem
                        onClick={() =>
                          push(`/patient/appointments/requests/${entry.id}`)
                        }
                      >
                        View
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedRequest && (
        <RequestDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          request={selectedRequest}
        />
      )}
    </>
  );
}
