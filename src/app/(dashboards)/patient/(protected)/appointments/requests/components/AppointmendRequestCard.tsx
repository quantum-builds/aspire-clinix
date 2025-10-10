"use client"

import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { CalenderInputIconV2, CancelIcon, UploadPDFIcon } from "@/assets";
import { useDeleteAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestMutation";
import { TAppointmentRequest } from "@/types/appointment-request";
import { showToast } from "@/utils/defaultToastOptions";
import { calculateAge, formatDate } from "@/utils/formatDateTime";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { AppointmentRequestStatus, AppointmentStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentRequestCard({
  request,
}: {
  request: TAppointmentRequest;
}) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: deleteAppointmentRequest, isPending } =
    useDeleteAppointmentRequests();
  const { refresh } = useRouter()

  const handleDeleteAppointmentRequest = () => {
    deleteAppointmentRequest(
      {
        id: request.id,
        patientId: request.patientId,
      },
      {
        onSuccess: () => {
          // replace(`/patient/appointments/requests?ts=${Date.now()}`);
          refresh()
          setIsCancelModalOpen(false);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
          setIsCancelModalOpen(false);
        },
      }
    );
  };

  const getStatus = (): AppointmentStatus => {
    switch (request.status) {
      case AppointmentRequestStatus.PENDING:
        return AppointmentStatus.PENDING;
      case AppointmentRequestStatus.CANCEL:
        return AppointmentStatus.CANCELLED;
      case AppointmentRequestStatus.APPROVED:
        return AppointmentStatus.CONFIRMED;
    }
  };

  const status = getStatus();


  return (
    <>
      <div className="rounded-2xl p-6 space-y-3 bg-gray focus:outline-none flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div>
            <p className="text-[22px] text-green font-semibold">
              Appoinment Details
            </p>
            <p className="flex items-center gap-1">
              Status: <StatusBage status={status} />
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-xl text-green">Personal Info</p>
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

          {request.appointment?.dentist &&
            <div className="space-y-2">
              <p className="text-xl font-semibold text-green mb-3">
                Dentists Details
              </p>
              <div>
                <div className="flex items-center">
                  <p className="w-3/4 truncate">
                    Name:{" "}
                    <span className="font-medium text-lg">
                      {request.appointment.dentist.fullName}
                    </span>
                  </p>
                  <p className="w-[33%]">
                    Phone:{" "}
                    <span className="font-medium text-lg">
                      {request.appointment.dentist.phoneNumber}
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="w-3/4 truncate">
                    Email:{" "}
                    <span className="font-medium text-lg">
                      {request.appointment.dentist.email}
                    </span>
                  </p>
                </div>

              </div>
            </div>
          }

          <div className="grid grid-cols-2 gap-4">
            {request.appointment?.date &&
              <div className="w-2/5 space-y-1">
                <p className="font-medium text-xl text-green text-nowrap">Appointment Date</p>
                <div className="flex gap-2 items-center">
                  <Image src={CalenderInputIconV2} alt="Calender Icon" />
                  <p className="text-lg tracking-tightest">
                    {formatDate(request.appointment?.date)}
                  </p>
                </div>
              </div>
            }
            <div className="w-2/5 space-y-1">
              <p className="font-medium text-xl text-green text-nowrap">Requested Date</p>
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
        </div>

        <div className="flex justify-end ">
          <CustomButton
            // style="secondary"
            handleOnClick={() => {
              // handleDeleteAppointmentRequest()
              setIsCancelModalOpen(true);
            }}
            className="bg-lightGray text-dashboardTextBlack hover:text-white"

            text="Delete Request"
          />
        </div>
      </div>
      <ConfirmationModal
        icon={CancelIcon}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={isPending}
        onConfirm={handleDeleteAppointmentRequest}
        title="Delete Request"
        description="Are you sure you want to delete this request? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />
    </>
  );
}
