"use client";

import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import PatientDetailsModal from "@/app/(dashboards)/dentist/(protected)/appointments/components/PatientDetailsModal";
import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { AppointmentDateType } from "@/types/common";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { useState } from "react";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
  type: AppointmentDateType;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  return (
    <div className="flex flex-col gap-1 p-5 rounded-2xl bg-gray">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Image
              src={CalenderInputIconV2}
              alt="Calendar Icon"
              className="w-4 h-4"
            />
            <p className="text-lg">{formatDate(appointment.date)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Image src={TimeIconV2} alt="TIme Icon" className="w-4 h-4" />
            <p className="text-lg">
              {" "}
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.finishTime)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium w-2/3 truncate">
          Appointment # {appointment.id.slice(0, 10)}
        </p>
        <PatientDetailsModal
          appointment={appointment}
          trigger={
            <p
              className="text-green text-lg font-semibold cursor-pointer"
              onClick={() => setOpenDetailsModal(true)}
            >
              See Details
            </p>
          }
          open={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
        />
      </div>
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 w-full mt-7">
          <CustomButton
            text="See Reports"
            href={`/clinic/appointments/${appointment.id}/reports`}
          />
        </div>
      </div>
    </div>
  );
}
