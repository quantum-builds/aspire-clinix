import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TAppointmentRequest } from "@/types/appointment-request";
import { calculateAge, formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

export default function PatientDetails({
  appointmentRequest,
}: {
  appointmentRequest: TAppointmentRequest;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl space-y-10">
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

      <div className="grid grid-cols-3  xl:gap-x-[100px] max-lg50:gap-x-0 max-lg50:justify-between gap-x-10 gap-y-5">
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
        <p className="text-lg">
          Gender:{" "}
          <span className="text-lg font-medium">
            {appointmentRequest.patient?.gender.toLowerCase()}
          </span>
        </p>
        <p className="text-lg">
          Email:{" "}
          <span className="text-lg font-medium">
            {appointmentRequest.patient?.email}
          </span>
        </p>
        <p className="text-lg">
          Age:{" "}
          <span className="text-lg font-medium">
            {calculateAge(
              appointmentRequest.patient?.dateOfBirth || new Date()
            )}
          </span>
        </p>
      </div>

      <div className="flex item-center xl:gap-[100px] gap-10 max-lg50:gap-0 max-lg50:justify-between">
        <div className="space-y-3">
          <p className="font-medium text-xl text-green">Requested Date</p>
          <div className="flex gap-2 items-center">
            <Image src={CalenderInputIcon} alt="Calender Icon" />
            <p className="text-lg tracking-tightest">
              {formatDate(appointmentRequest.requestedDate)}
            </p>
          </div>
        </div>
        <div className="space-y-3 col-span-4">
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
    </div>
  );
}
