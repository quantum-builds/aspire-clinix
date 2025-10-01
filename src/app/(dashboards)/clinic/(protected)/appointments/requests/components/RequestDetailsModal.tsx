"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CalenderInputIconV2, CloseIcon, UploadPDFIcon } from "@/assets";
import Image from "next/image";
import { TAppointmentRequest } from "@/types/appointment-request";
import { formatDate } from "@/utils/formatDateTime";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { AppointmentRequestStatus } from "@prisma/client";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { usePatchAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestMutation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RequestDetailsModal({
  open,
  onClose,
  request,
}: {
  open: boolean;
  onClose: () => void;
  request: TAppointmentRequest;
}) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: updateAppointmentRequest, isPending } =
    usePatchAppointmentRequest();
  const { refresh } = useRouter();

  const handleCancelAppointment = () => {
    // cancelAppointment(
    //   {
    //     appointment: { state: AppointmentStatus.CANCELLED },
    //     id: appointment.id,
    //     patientId: appointment.patientId, // will be getting in backend when token is implemented
    //   },
    //   {
    //     onSuccess: (data) => {
    //       console.log("updated appointment ", data);
    //       refresh();
    //       setIsCancelModalOpen(false);
    //     },
    //   }
    // );
    const partialAppointmentRequest: Partial<TAppointmentRequest> = {
      status: AppointmentRequestStatus.CANCEL,
    };
    updateAppointmentRequest(
      {
        id: request.id!,
        appointmentRequest: partialAppointmentRequest,
      },
      {
        onSuccess: () => {
          refresh();
          setIsCancelModalOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent className="w-[720px] rounded-2xl p-6 space-y-3  focus:outline-none">
        <div className="flex items-center justify-between w-[95%]">
          <p className="font-semibold text-green text-2xl">Request Details</p>
          <div
            className="size-11 cursor-pointer flex justify-center items-center bg-gray rounded-full"
            onClick={onClose}
          >
            <Image src={CloseIcon} alt="close" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xl font-semibold text-green mb-3">
            Patient Details
          </p>
          <div className="flex items-center gap-4">
            <p className="w-2/5 truncate">
              Name:{" "}
              <span className="font-medium text-lg">
                {request.patient?.fullName}
              </span>
            </p>
            <p className="flex-1 truncate">
              Email:{" "}
              <span className="font-medium text-lg">
                {request.patient?.email}
              </span>
            </p>
          </div>
          <p>
            Phone:{" "}
            <span className="font-medium text-lg">
              {request.patient?.phoneNumber}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <div className="w-2/5 space-y-1">
            <p className="font-medium text-xl text-green">Appointment Date</p>
            <div className="flex gap-2 items-center">
              <Image src={CalenderInputIconV2} alt="Calender Icon" />
              <p className="text-lg tracking-tightest">
                {formatDate(request.requestedDate)}
              </p>
            </div>
          </div>
          <div className=" space-y-1">
            <p className="font-medium text-xl text-green">Appointment Reason</p>
            <p className="text-lg tracking-tightest truncate">
              {request.reason.slice(0, 50)}
            </p>
          </div>
        </div>

        {request.note && (
          <div className="space-y-1">
            <p className="text-xl font-medium text-green">Note:</p>
            <p className="tracking-tightest text-xl line-clamp-3 w-[90%]">
              {request?.note}
            </p>
          </div>
        )}

        {request.file && (
          <PdfModal
            pdfUrl={request.file}
            trigger={
              <div className="flex items-center gap-3 cursor-pointer">
                <Image src={UploadPDFIcon} alt="PDF Icon" />
                <p className="underline text-green">See Document</p>
              </div>
            }
          />
        )}

        <div className="flex gap-5">
          {request.status === AppointmentRequestStatus.PENDING && (
            <CustomButton
              text="Book an Appointment"
              href={`/clinic/appointments/requests/${request.id}/book`}
            />
          )}
          {request.status === AppointmentRequestStatus.PENDING && (
            <CustomButton
              style="secondary"
              handleOnClick={() => setIsCancelModalOpen(true)}
              text="Cancel"
            />
          )}
        </div>

        <ConfirmationModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          isPending={isPending}
          onConfirm={handleCancelAppointment}
          title="Cancel Appointemnt Rquest"
          description="Are you sure you want to cancel this request? This action cannot be undone."
          cancelText="No, Keep Request"
          confirmText="Yes, Cancel Request"
        />
      </DialogContent>
    </Dialog>
  );
}
