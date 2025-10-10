"use client";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import { usePatchAppointment } from "@/services/appointments/appointmentMutation";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { AppointmentStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PatientDetailsModal from "../../components/PatientDetailsModal";
import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";

interface RequestAppointmentCardProps {
  appointment: TAppointment;
}

export default function RequestAppointmentCard({
  appointment,
}: RequestAppointmentCardProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const router = useRouter();
  const { mutate: updateAppointment, isPending: updateAppointmentLoader } =
    usePatchAppointment();

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    const partialAppointment: Partial<TAppointment> = {
      state: newStatus,
    };
    updateAppointment(
      {
        id: appointment.id,
        appointment: partialAppointment,
        dentistId: appointment.dentistId,
      },
      {
        onSuccess: () => {
          router.refresh();
          setIsCancelModalOpen(false);
          setIsConfirmModalOpen(false);
        }, onError: (error) => {
          const err = getAxiosErrorMessage(error)
          showToast("error", err)
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-1 p-5 rounded-2xl bg-gray">
      {/* Top Section */}
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
            <Image src={TimeIconV2} alt="Time Icon" className="w-4 h-4" />
            <p className="text-lg">
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.finishTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section */}
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

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-1 items-center">
          <p className="text-lg flex gap-1 items-center">
            Status: <StatusBage status={appointment.state} />
          </p>
        </div>
      </div>

      {/* Actions */}
      {appointment.state !== AppointmentStatus.CANCELLED && (
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2 w-full mt-7">
            {appointment.state === AppointmentStatus.PENDING && (
              <CustomButton
                text="Confirm Appointment"
                handleOnClick={() => setIsConfirmModalOpen(true)}
              />
            )}

            <CustomButton
              style="white"
              handleOnClick={() => setIsCancelModalOpen(true)}
              text="Cancel Appointment"
            />
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={updateAppointmentLoader}
        onConfirm={() => handleStatusChange(AppointmentStatus.CANCELLED)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />

      {/* Confirm Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        isPending={updateAppointmentLoader}
        onConfirm={() => handleStatusChange(AppointmentStatus.CONFIRMED)}
        title="Confirm Appointment"
        description="Do you want to confirm this appointment?"
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}
