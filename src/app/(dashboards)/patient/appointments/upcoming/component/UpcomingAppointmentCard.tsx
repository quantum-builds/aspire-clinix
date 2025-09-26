"use client";

import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { AppointmentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { usePatchAppointment } from "@/services/appointments/appointmentMutation";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const { mutate: cancelAppointment } = usePatchAppointment();
  const { refresh } = useRouter();

  const handleCancelAppointment = () => {
    cancelAppointment(
      {
        appointment: { state: AppointmentStatus.CANCELLED },
        id: appointment.id,
        patientId: appointment.patientId, // will be getting in backend when token is implemented
      },
      {
        onSuccess: (data) => {
          console.log("updated appointment ", data);
          refresh();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-gray">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
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
              <p className="text-lg">{formatTime(appointment.date)}</p>
            </div>
          </div>
          <p className="text-lg italic">Appointment # APT-1010</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium w-2/3 truncate">
          Appointment With Dr. {appointment.dentist.fullName}
        </p>
        <p className="text-green text-lg">See Details</p>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 w-full mt-5">
          <CustomButton
            text="See Reports"
            href={`/patient/appointments/${appointment.id}/reports`}
          />
          <CustomButton
            className="bg-dashboardBarBackground text-dashboardTextBlack"
            handleOnClick={handleCancelAppointment}
            text="Cancel Appointment"
          />
        </div>
      </div>
    </div>
  );
}
