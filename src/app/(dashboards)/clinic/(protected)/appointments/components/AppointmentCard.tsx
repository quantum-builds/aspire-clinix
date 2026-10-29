"use client";

import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { CalenderInputIconV2, CancelIcon, TimeIconV2 } from "@/assets";
import { useChangeAppointmentState } from "@/services/appointments/appointmentMutation";
import { AppointmentState, TAppointment } from "@/types/appointment";
import { AppointmentDateType } from "@/types/common";
import { showToast } from "@/utils/defaultToastOptions";
import { formatDate } from "@/utils/formatDateTime";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { TIMEZONE } from "@/utils/slotSelectionUtils";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
  type: AppointmentDateType;
  showCancel?: boolean;
}

const CANCELLABLE_STATES = [AppointmentState.PENDING, AppointmentState.CONFIRMED];

export default function UpcomingAppointmentCard({
  appointment,
  type,
  showCancel = false,
}: UpcomingAppointmentCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: cancelAppointment, isPending: isCancelAppointment } =
    useChangeAppointmentState();
  const { refresh } = useRouter();

  // The clinic may cancel at any time; only the patient has the 24 h window.
  const canCancel =
    showCancel &&
    type === AppointmentDateType.UPCOMING &&
    CANCELLABLE_STATES.includes(appointment.state);

  const handleCancelAppointment = () => {
    cancelAppointment(
      {
        appointment: { state: AppointmentState.CANCELLED },
        id: appointment.id,
      },
      {
        onSuccess: () => {
          refresh();
          setIsCancelModalOpen(false);
        },
        onError: (error) => {
          showToast("error", getAxiosErrorMessage(error));
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
                {formatInTimeZone(new Date(appointment.startTime), TIMEZONE, "HH:mm")} -{" "}
                {formatInTimeZone(new Date(appointment.finishTime), TIMEZONE, "HH:mm")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 w-full mt-7">
          <CustomButton
            text="See Reports"
            href={`/clinic/appointments/${appointment.id}/reports`}
          />

          {canCancel && (
            <CustomButton
              style="white"
              handleOnClick={() => setIsCancelModalOpen(true)}
              text="Cancel Appointment"
            />
          )}
        </div>
      </div>

      {canCancel && (
        <ConfirmationModal
          icon={CancelIcon}
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancelAppointment}
          isPending={isCancelAppointment}
          title="Cancel Appointment"
          description="Cancel this Breathwork session? If the patient paid, they get a full refund; if they used their plan, the session goes back to their plan."
          cancelText="No"
          confirmText="Yes"
        />
      )}
    </div>
  );
}
