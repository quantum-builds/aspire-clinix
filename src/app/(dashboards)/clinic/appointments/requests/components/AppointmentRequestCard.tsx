"use client";

import Button from "@/app/(dashboards)/components/Button";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { CalenderInputIcon, TimeIcon, UploadPDFIcon } from "@/assets";
import { usePatchAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestMutation";
import { TAppointmentRequest } from "@/types/appointment-request";
import { calculateAge, formatDate, formatTime } from "@/utils/formatDateTime";
import { AppointmentRequestStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentRequestCard({
  appointmentRequest,
}: {
  appointmentRequest: TAppointmentRequest;
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
        id: appointmentRequest.id,
        appointmentRequest: partialAppointmentRequest,
      },
      {
        onSuccess: (data) => {
          refresh();
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
              {" "}
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
          {/* <p className="text-lg">
            Disease:{" "}
            <span className="text-lg font-medium">
              {appointmentRequest.}
            </span>
          </p> */}
          <p className="text-lg">
            Age:{" "}
            <span className="text-lg font-medium">
              {calculateAge(
                appointmentRequest.patient?.dateOfBirth || new Date()
              )}
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
        {appointmentRequest.file && (
          <div className="flex items-center gap-5">
            <Image src={UploadPDFIcon} alt="PDF Icon" />
            <p className="underline text-green">See Document</p>
          </div>
        )}
        <div className="flex justify-end w-full gap-5">
          {appointmentRequest.status === AppointmentRequestStatus.PENDING && (
            <CustomButton
              className="bg-dashboardBarBackground text-dashboardTextBlack"
              handleOnClick={() => setIsCancelModalOpen(true)}
              text="Cancel Request"
            />
          )}
          {appointmentRequest.status !== AppointmentRequestStatus.APPROVED && (
            <Button
              text="Book an Appointment"
              href={`/clinic/appointments/requests/${appointmentRequest.id}/book`}
            />
          )}
        </div>
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
    </div>
  );
}
