"use client";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { CalenderInputIconV2, CancelIcon, TimeIconV2 } from "@/assets";
import { usePatchAppointment } from "@/services/appointments/appointmentMutation";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { AppointmentStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PatientDetailsModal from "../../components/PatientDetailsModal";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsCOnfirmModelOpen] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const router = useRouter();
  const { mutate: updateAppointment, isPending: updateAppointmentLoader } =
    usePatchAppointment();

  const handleStusChange = () => {
    const partialAppointment: Partial<TAppointment> = {
      state: isCancelModalOpen
        ? AppointmentStatus.CANCELLED
        : isConfirmModalOpen
        ? AppointmentStatus.CONFIRMED
        : AppointmentStatus.PENDING,
    };
    console.log("appointment dentist id is ", appointment.dentistId);
    updateAppointment(
      {
        id: appointment.id,
        appointment: partialAppointment,
        dentistId: "cmfpmcxf00003l6qa0rh5trss",
      },
      {
        onSuccess: (data) => {
          console.log("data on success,", data);
          router.refresh();
          setIsCancelModalOpen(false);
          setIsCOnfirmModelOpen(false);
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
            href={`/dentist/appointments/${appointment.id}/reports`}
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
        icon={CancelIcon}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={updateAppointmentLoader}
        onConfirm={handleStusChange}
        title="Cancel Appointemnt"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}
