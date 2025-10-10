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
import { CalenderInputIconV2, CancelIcon } from "@/assets";
import { formatDate } from "@/utils/formatDateTime";
import { TAppointmentRequest } from "@/types/appointment-request";
import { AppointmentRequestStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RequestDetailsModal from "./RequestDetailsModal";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { usePatchAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestMutation";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";
import { TableActionMenu } from "@/app/(dashboards)/components/custom-components/TableActionMenu";

export function RequestsDataTable({ entries }: { entries: TAppointmentRequest[] }) {
  const [selectedRequest, setSelectedRequest] = useState<TAppointmentRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<TAppointmentRequest | null>(null);
  const { mutate: updateAppointmentRequest, isPending } = usePatchAppointmentRequest();
  const { refresh, push } = useRouter();

  const handleRowClick = (request: TAppointmentRequest) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleCancelAppointment = () => {
    if (!requestToCancel) return;
    const partialAppointmentRequest: Partial<TAppointmentRequest> = {
      status: AppointmentRequestStatus.CANCEL,
    };
    updateAppointmentRequest(
      {
        id: requestToCancel.id!,
        appointmentRequest: partialAppointmentRequest,
      },
      {
        onSuccess: () => {
          refresh();
          setIsCancelModalOpen(false);
          showToast("success", "Appointment request cancelled successfully");
        },
        onError: (error) => {
          const err = getAxiosErrorMessage(error);
          showToast("error", err);
        },
      }
    );
  };

  const getMenuOptions = (entry: TAppointmentRequest) => {
    if (entry.status !== AppointmentRequestStatus.PENDING) return [];

    return [
      {
        label: "Book Appointment",
        onClick: () => push(`/clinic/appointments/requests/${entry.id}/book`),
      },
      {
        label: "Cancel Appointment",
        onClick: () => {
          setRequestToCancel(entry);
          setIsCancelModalOpen(true);
        },
      },
    ];
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="border-separate border-spacing-y-3 min-w-max">
          <TableHeader>
            <TableRow className="bg-dashboardBackground">
              <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-l-full text-xl text-dashboardTextBlack font-medium">
                Patient Name
              </TableHead>
              <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
                Patient Email
              </TableHead>
              <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
                Patient Phone
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
                className="text-lg hover:bg-gray text-dashboardTextBlack"
              >
                <TableCell
                  className="px-6 py-4 rounded-l-full cursor-pointer"
                  onClick={() => handleRowClick(entry)}
                >
                  {entry.patient?.fullName}
                </TableCell>
                <TableCell
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => handleRowClick(entry)}
                >
                  {entry.patient?.email}
                </TableCell>
                <TableCell
                  className="px-6 py-4 flex gap-1 items-center cursor-pointer"
                  onClick={() => handleRowClick(entry)}
                >
                  {entry.patient?.phoneNumber}
                </TableCell>
                <TableCell
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => handleRowClick(entry)}
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className={`size-3 rounded-[4px] ${entry.status === AppointmentRequestStatus.APPROVED
                          ? "bg-green"
                          : entry.status === AppointmentRequestStatus.PENDING
                            ? "bg-[#fcd833]"
                            : "bg-[#FF0000]"
                        }`}
                    />
                    {entry.status}
                  </div>
                </TableCell>
                <TableCell
                  className="px-6 py-4 flex gap-1 items-center cursor-pointer"
                  onClick={() => handleRowClick(entry)}
                >
                  <Image
                    src={CalenderInputIconV2}
                    alt="calendar icon"
                    className="w-5 h-5"
                  />
                  <span>{formatDate(entry.requestedDate)}</span>
                </TableCell>

                <TableCell className="px-6 py-4 rounded-r-full">
                  <TableActionMenu options={getMenuOptions(entry)} />
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

      <ConfirmationModal
        icon={CancelIcon}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={isPending}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment Request"
        description="Are you sure you want to cancel this request? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />
    </>
  );
}
