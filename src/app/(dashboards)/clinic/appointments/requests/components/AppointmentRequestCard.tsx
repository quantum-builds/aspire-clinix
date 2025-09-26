import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon, UploadPDFIcon } from "@/assets";
import { TAppointmentRequest } from "@/types/appointment-request";
import { calculateAge, formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

export default function AppointmentRequestCard({
  appointmentRequest,
}: {
  appointmentRequest: TAppointmentRequest;
}) {
  console.log(appointmentRequest);
  return (
    <div className="rounded-2xl p-6 space-y-10 bg-gray">
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
        <div className="flex justify-end w-full">
          <Button
            text="Book an Appointment"
            href={`/clinic/appointments/requests/${appointmentRequest.id}/book`}
          />
        </div>
      </div>
    </div>
  );
}
