"use client";

import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import Image from "next/image";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { useState } from "react";
import AppointmentDetailsModal from "../../components/AppointmentDetailsModal";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function PastAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2 p-5 rounded-2xl bg-gray">
        <div className="flex justify-between gap-2 items-center">
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

        <div className="flex items-center justify-between">
          <p className="text-xl font-medium w-2/3 truncate">
            Appointment # {appointment.id.slice(0, 10)}
          </p>
          <AppointmentDetailsModal
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

        <div className="flex justify-between items-center mt-7">
          <CustomButton
            text="See Reports"
            href={`/patient/appointments/${appointment.id}/reports`}
          />
          <p className="text-[17px] text-green font-semibold">
            Appointment with {appointment.dentist.fullName}
          </p>
        </div>
      </div>
    </>
  );
}
