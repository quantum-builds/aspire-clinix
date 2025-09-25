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
import { CalenderInputIcon } from "@/assets";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { TAppointmentRequest } from "@/types/appointment-request";

import { AppointmentRequestStatus } from "@prisma/client";
import { useState } from "react";
import { useDeleteAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestMutation";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";

interface RequestsDataTable {
  entries: TAppointmentRequest[];
}

export function RequestsDataTable({ entries }: RequestsDataTable) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: deleteAppointmentRequest } = useDeleteAppointmentRequests();
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    patientId: string;
  } | null>(null);
  const { refresh, push } = useRouter();

  const handleDeleteAppointmentRequest = (id: string, patientId: string) => {
    deleteAppointmentRequest(
      {
        id: id,
        patientId: patientId,
      },
      {
        onSuccess: () => {
          refresh();
          setSelectedRequest(null);
          setIsCancelModalOpen(false);
        },
        onError: () => {
          // Also clear state on error
          setSelectedRequest(null);
          setIsCancelModalOpen(false);
        },
      }
    );
  };

  const handleModalClose = () => {
    console.log("in modal close");
    setSelectedRequest(null);
    setIsCancelModalOpen(false);
  };

  const handleDeleteClick = (id: string, patientId: string) => {
    setSelectedRequest({
      id,
      patientId,
    });
    setIsCancelModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequest) {
      handleDeleteAppointmentRequest(
        selectedRequest.id,
        selectedRequest.patientId
      );
    }
  };

  return (
    <>
      <Table className="border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Request #
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Reason
            </TableHead>
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
              className="bg-dashboardBackground text-lg text-dashboardTextBlack"
            >
              <TableCell className="px-6 py-4 rounded-l-full">
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
                      onClick={() =>
                        push(`/patient/appointments/requests/${entry.id}`)
                      }
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(entry.id, entry.patientId);
                      }}
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

      {/* Modal completely outside the table */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmDelete}
        title="Delete Request"
        description="Are you sure you want to delete this request? This action cannot be undone."
        cancelText="No, Keep the Request"
        confirmText="Yes, Delete the Request"
      />
    </>
  );
}
