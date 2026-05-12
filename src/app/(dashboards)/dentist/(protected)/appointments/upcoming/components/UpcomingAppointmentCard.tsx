"use client";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { CalenderInputIconV2, CancelIcon, TimeIconV2 } from "@/assets";
import { useChangeAppointmentState } from "@/services/appointments/appointmentMutation";
import {
  AppointmentState,
  TAppointment,
  TChangeAppointmentState,
} from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsCOnfirmModelOpen] = useState(false);
  const { refresh } = useRouter();
  const { mutate: updateAppointment, isPending: updateAppointmentLoader } =
    useChangeAppointmentState();

  const handleStusChange = () => {
    const partialAppointment: TChangeAppointmentState = {
      state: isCancelModalOpen
        ? AppointmentState.CANCELLED
        : isConfirmModalOpen
          ? AppointmentState.CONFIRMED
          : AppointmentState.PENDING,
    };
    updateAppointment(
      {
        appointment: partialAppointment,
        id: appointment.id,
        dentistId: appointment.practitionerId,
      },
      {
        onSuccess: (data) => {
          console.log("updated appointment ", data);
          refresh();
          setIsCancelModalOpen(false);
          setIsCOnfirmModelOpen(false);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 p-5 rounded-2xl bg-gray">
      <div className="flex items-center justify-between">
        <p className="italic text-green font-medium text-xl">
          Status: {appointment.state}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-xl font-semibold text-green">Patient Details</p>
          <div>
            <p className="truncate">
              Name:{" "}
              <span className="font-medium text-lg">
                {appointment.patientName}
              </span>
            </p>
            <p>
              Reason:{" "}
              <span className="font-medium text-lg">{appointment.reason}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xl font-semibold text-green">Dentists Details</p>
          <div>
            <p className="truncate">
              Name:{" "}
              <span className="font-medium text-lg">
                {appointment.practitionerName}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xl font-semibold text-green mb-3">
          Appointment Date & Time
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <Image
              src={CalenderInputIconV2}
              alt="Calendar Icon"
              className="w-4 h-4 shrink-0"
            />
            <p>
              Date:{" "}
              <span className="font-medium text-lg">
                {formatDate(appointment.startTime)}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={TimeIconV2}
              alt="Time Icon"
              className="w-4 h-4 shrink-0"
            />
            <p>
              Time:{" "}
              <span className="font-medium text-lg">
                {formatTime(appointment.startTime)} -{" "}
                {formatTime(appointment.finishTime)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 w-full mt-7">
          <CustomButton
            text="See Reports"
            href={`/dentist/appointments/${appointment.id}/reports`}
          />
          {appointment.state !== AppointmentState.CONFIRMED && (
            <CustomButton
              style="white"
              handleOnClick={() => setIsCOnfirmModelOpen(true)}
              text="Confirm Appointment"
            />
          )}
          {appointment.state !== AppointmentState.CANCELLED && (
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
        isOpen={isCancelModalOpen || isConfirmModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setIsCOnfirmModelOpen(false);
        }}
        isPending={updateAppointmentLoader}
        onConfirm={handleStusChange}
        title={isCancelModalOpen ? "Cancel Appointment" : "Confirm Appointment"}
        description={
          isCancelModalOpen
            ? "Are you sure you want to cancel this appointment?"
            : "Are you sure you want to confirm this appointment?"
        }
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}
