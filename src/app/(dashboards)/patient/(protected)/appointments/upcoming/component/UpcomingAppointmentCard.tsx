"use client";

import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { AppointmentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { usePatchAppointment } from "@/services/appointments/appointmentMutation";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { useState } from "react";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import AppointmentDetailsModal from "../../components/AppointmentDetailsModal";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

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
        onError: () => {
          setIsCancelModalOpen(false);
        },
      }
    );
  };

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
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 w-full mt-7">
          <CustomButton
            text="See Reports"
            href={`/patient/appointments/${appointment.id}/reports`}
          />

          {appointment.state !== AppointmentStatus.CANCELLED && (
            <CustomButton
              style="white"
              handleOnClick={() => setIsCancelModalOpen(true)}
              text="Cancel Appointment"
            />
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelAppointment}
        isPending={isCancelAppointment}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        cancelText="No, Keep Appointment"
        confirmText="Yes, Cancel Appointment"
      />
    </div>
  );
}
