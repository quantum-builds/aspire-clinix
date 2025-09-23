import { CalenderInputIcon, TimeIcon } from "@/assets";
import { AppointmentRequest } from "@/types/common";
import Image from "next/image";

export default function PatientDetails({
  appointment,
}: {
  appointment: AppointmentRequest;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl space-y-10">
      <div className="flex items-center justify-between">
        <p className="text-green font-medium text-[22px]">Patient Details</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image src={CalenderInputIcon} alt="Calender Icon" />
            <p className="text-xl">{appointment.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <Image src={TimeIcon} alt="Time Icon" />
            <p className="text-xl">{appointment.time}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5">
        <p className="text-lg">
          Name:{" "}
          <span className="text-lg font-medium">{appointment.patientName}</span>
        </p>
        <p className="text-lg">
          Phone:{" "}
          <span className="text-lg font-medium">
            {appointment.patientPhone}
          </span>
        </p>
        <p className="text-lg">
          Email:{" "}
          <span className="text-lg font-medium">
            {appointment.patientEmail}
          </span>
        </p>
        <p className="text-lg">
          Disease:{" "}
          <span className="text-lg font-medium">{appointment.disease}</span>
        </p>
      </div>

      <div className="grid grid-cols-5">
        <div className="space-y-3">
          <p className="font-medium text-xl text-green">Appointment Date</p>
          <div className="flex gap-2 items-center">
            <Image src={CalenderInputIcon} alt="Calender Icon" />
            <p className="text-lg tracking-tightest">
              {appointment.appointmentDate}
            </p>
          </div>
        </div>
        <div className="space-y-3 col-span-4">
          <p className="font-medium text-xl text-green">Appointment Reason</p>

          <p className="text-lg tracking-tightest">
            {appointment.appointmentReason}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-medium text-green">Note:</p>
        <p className="tracking-tightest text-xl">
          {appointment?.additionalNote}
        </p>
      </div>
    </div>
  );
}
