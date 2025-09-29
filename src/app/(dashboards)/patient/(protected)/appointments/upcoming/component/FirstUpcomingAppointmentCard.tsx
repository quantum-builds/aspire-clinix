"use client";

import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import { usePatchAppointment } from "@/services/appointments/appointmentMutation";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { AppointmentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { useState } from "react";

interface FirstUpcomingAppointmentCardProps {
  appointment: TAppointment;
}
export default function FirstUpcomingAppointmentCard({
  appointment,
}: FirstUpcomingAppointmentCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: cancelAppointment, isPending: isCancelAppointment } =
    usePatchAppointment();
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
          setIsCancelModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-dashboardBarBackground py-5 px-8 rounded-2xl">
      <div className="space-y-1">
        <div className="flex gap-3 justify-between items-center">
          <p className="font-medium text-[22px]">Upcoming Appointment</p>
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
              <p className="text-lg">
                {formatTime(appointment.startTime)} -{" "}
                {formatTime(appointment.finishTime)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex  gap-3 items-center justify-between">
          <p className="text-lg">
            Status:{" "}
            <span className="font-medium italic">{appointment.state}</span>
          </p>

          <p className="text-lg italic">
            Appointment # APT-{appointment.id.slice(0, 10)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[21px] font-semibold text-green">Dentist Details</p>
        <div className="grid grid-row-3 gap-y-2 gap-x-5">
          <div className="flex items-start max-1xl:justify-between gap-2 text-lg">
            <div className="1xl:flex-[25%] space-y-2">
              <p>
                Name:{" "}
                <span className="font-medium">
                  {appointment.dentist.fullName}
                </span>
              </p>
              <p className="text-lg">
                Phone:{" "}
                <span className="font-medium">
                  {appointment.dentist.phoneNumber}
                </span>
              </p>
            </div>
            <div className="1xl:flex-[30%] space-y-2">
              <p>
                GDC no:{" "}
                <span className="font-medium">{appointment.dentist.gdcNo}</span>
              </p>
              <p className="text-lg">
                Email:{" "}
                <span className="font-medium">{appointment.dentist.email}</span>
              </p>
            </div>
          </div>

          <p className=" text-lg">
            Practice Address:{" "}
            <span className="font-medium">
              {appointment.dentist.practiceAddress}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <CustomButton
            text="See Reports"
            href={`/patient/appointments/${appointment.id}/reports`}
          />

          {appointment.state !== AppointmentStatus.CANCELLED && (
            <CustomButton
              style="secondary"
              text="Cancel Appoinment"
              handleOnClick={() => setIsCancelModalOpen(true)}
            />
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={isCancelAppointment}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        cancelText="No, Keep Appointment"
        confirmText="Yes, Cancel Appointment"
      />
    </div>
  );
}
