"use client";
import Button from "@/app/(dashboards)/components/Button";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import { usePatchAppointment } from "@/services/appointments/appointmentMutation";
import { TAppointment } from "@/types/appointment";
import { calculateAge, formatDate, formatTime } from "@/utils/formatDateTime";
import { AppointmentStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsCOnfirmModelOpen] = useState(false);
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
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBackground">
      <div className="flex justify-between items-center">
        <p className="font-medium text-xl text-green">Appointment</p>
        <div className="flex flex-col gap-3  items-end">
          <div className="flex items-center gap-3">
            {appointment.state !== AppointmentStatus.CANCELLED && (
              <CustomButton
                style="secondary"
                handleOnClick={() => setIsCancelModalOpen(true)}
                text="Cancel"
              />
            )}
            {appointment.state !== AppointmentStatus.CONFIRMED && (
              <CustomButton
                style="primary"
                handleOnClick={() => setIsCOnfirmModelOpen(true)}
                text="Confirm"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-xl text-green">Patient Details</p>
          <p className="italic text-green">
            Status:{" "}
            <span className="text-dashboardTextBlack">{appointment.state}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3  items-end">
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
        </div>
      </div>
      <div className="grid grid-row-2 gap-y-5 gap-x-5">
        <div className="flex justify-between items-center">
          <p className="flex-[40%] text-lg">
            Name:{" "}
            <span className="font-medium">{appointment.patient.fullName}</span>
          </p>
          <p className="flex-[60%] text-lg text-right">
            Disease: <span className="font-medium">{appointment.reason}</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex-[50%] text-lg">
            Phone No:{" "}
            <span className="font-medium">
              {appointment.patient.phoneNumber}
            </span>
          </p>
          <p className="flex-[30%] text-lg">
            Age:
            <span className="font-medium">
              {calculateAge(appointment.patient.dateOfBirth)}
            </span>
          </p>
          <p className="flex-[20%] text-right text-lg">
            Gender:
            <span className="font-medium">
              {appointment.patient.gender.toLowerCase()}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button
          text="See Reports"
          href={`/dentist/appointments/${appointment.id}/reports`}
        />
        <p className="text-lg italic">Appointment # {appointment.id}</p>
      </div>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={updateAppointmentLoader}
        onConfirm={handleStusChange}
        title="Cancel Appointemnt"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        cancelText="No, Keep Appointment"
        confirmText="Yes, Cancel Appointment"
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsCOnfirmModelOpen(false)}
        isPending={updateAppointmentLoader}
        onConfirm={handleStusChange}
        title="Confirm Appointemnt"
        description="Are you sure you want to confirm this appointment? This action cannot be undone."
        cancelText="No, keep it PENDING"
        confirmText="Yes, Confirm Appointment"
      />
    </div>
  );
}
