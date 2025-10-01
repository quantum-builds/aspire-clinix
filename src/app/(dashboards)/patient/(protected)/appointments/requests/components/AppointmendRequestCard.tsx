import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { CalenderInputIconV2, UploadPDFIcon } from "@/assets";
import { TAppointmentRequest } from "@/types/appointment-request";
import { formatDate } from "@/utils/formatDateTime";
import { AppointmentRequestStatus, AppointmentStatus } from "@prisma/client";
import Image from "next/image";

export default function AppointmentRequestCard({
  request,
}: {
  request: TAppointmentRequest;
}) {
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
    <div className="rounded-2xl p-6 space-y-3 bg-gray focus:outline-none">
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
            GDC No.{" "}
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
    </div>
  );
}
