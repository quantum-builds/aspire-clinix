"use client";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { PdfDownload } from "@/app/(dashboards)/components/PdfDownload";
import { CalenderInputIcon, PDFImage, TimeIcon, UploadPDFIcon } from "@/assets";
import { useDeleteAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestMutation";
import { TAppointmentRequest } from "@/types/appointment-request";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentRequestCard({
  appointmentRequest,
}: {
  appointmentRequest: TAppointmentRequest;
}) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: deleteAppointmentRequest, isPending } =
    useDeleteAppointmentRequests();
  const { replace } = useRouter();

  const handleDeleteAppointmentRequest = () => {
    deleteAppointmentRequest(
      {
        id: appointmentRequest.id,
        patientId: appointmentRequest.patientId,
      },
      {
        onSuccess: () => {
          replace(`/patient/appointments/requests?ts=${Date.now()}`);
          setIsCancelModalOpen(false);
        },
        onError: () => {
          setIsCancelModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="rounded-2xl p-6 space-y-10 bg-dashboardBackground">
      <div className="flex items-center justify-between">
        <p className="text-green font-medium text-[22px]">Patient Details</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image src={CalenderInputIcon} alt="Calender Icon" />
            <p className="text-xl">
              {formatDate(appointmentRequest.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image src={TimeIcon} alt="Time Icon" />
            <p className="text-xl">
              {formatTime(appointmentRequest.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="space-y-3 flex-1">
          <p className="text-lg">
            Name:{" "}
            <span className="text-lg font-medium">
              {appointmentRequest.patient?.fullName}
            </span>
          </p>
          <p className="text-lg">
            Phone:{" "}
            <span className="text-lg font-medium">
              {appointmentRequest.patient?.phoneNumber}
            </span>
          </p>
        </div>
        <div className="space-y-3 flex-1">
          <p className="text-lg">
            Email:{" "}
            <span className="text-lg font-medium">
              {appointmentRequest.patient?.email}
            </span>
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 space-y-3">
          <p className="font-medium text-xl text-green">Appointment Date</p>
          <div className="flex gap-2 items-center">
            <Image src={CalenderInputIcon} alt="Calender Icon" />
            <p className="text-lg tracking-tightest">
              {formatDate(appointmentRequest.requestedDate)}
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <p className="font-medium text-xl text-green">Appointment Reason</p>

          <p className="text-lg tracking-tightest">
            {appointmentRequest.reason}
          </p>
        </div>
      </div>

      {appointmentRequest.note && (
        <div className="space-y-3">
          <p className="text-xl font-medium text-green">Note:</p>
          <p className="tracking-tightest text-xl">
            {appointmentRequest?.note}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* <Image src={UploadPDFIcon} alt="PDF Icon" /> */}
          {appointmentRequest.file && (
            <>
              <PdfDownload
                pdf={appointmentRequest.file}
                trigger={
                  <button className="bg-green text-green hover:text-decoration-underline  shadow  hover:bg-greenHover transition">
                    Download
                  </button>
                }
              />
              <p className="underline text-green">See Document</p>
            </>
          )}
        </div>
        <button
          className="h-[60px] px-6 py-3 font-medium text-lg rounded-full bg-dashboardBarBackground"
          onClick={() => setIsCancelModalOpen(true)}
        >
          Delete Appoinment Request
        </button>
      </div>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        isPending={isPending}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleDeleteAppointmentRequest}
        title="Cancel Request"
        description="Are you sure you want to cancel this reqyes? This action cannot be undone."
        cancelText="No, Keep the Request"
        confirmText="Yes, Cancel the Request"
      />
    </div>
  );
}
