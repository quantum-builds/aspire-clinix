"use client";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { CalenderInputIconV2, CancelIcon, TimeIconV2 } from "@/assets";
import { useChangeAppointmentState } from "@/services/appointments/appointmentMutation";
import { AppointmentState, TAppointment, TChangeAppointmentState } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { AppointmentStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PatientDetailsModal from "../../components/PatientDetailsModal";
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
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
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
        dentistId: appointment.practitionerId
      },
      {
        onSuccess: (data) => {
          console.log("updated appointment ", data);
          refresh();
          setIsCancelModalOpen(false);
          setIsCOnfirmModelOpen(false)
        }, onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      }
    );
  };
  console.log("aapointment ", appointment)

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
            <p className="text-lg">{formatDate(appointment.startTime)}</p>
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
          Appointment # {appointment.id}
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
          setIsCancelModalOpen(false)
          setIsCOnfirmModelOpen(false)
        }}
        isPending={updateAppointmentLoader}
        onConfirm={handleStusChange}
        title={isCancelModalOpen ? "Cancel Appointment" : "Confirm Appointment"}
        description={isCancelModalOpen ? "Are you sure you want to cancel this appointment?" : "Are you sure you want to confirm this appointment?"}
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}
