"use client";

import { capitalize } from "@/utils/formatWords";
import { CalenderInputIconV2, DropDownIcon, TimeIconV2 } from "@/assets";
import { AppointmentState, TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import PatientDetailsModal from "../../components/PatientDetailsModal";
import { useState } from "react";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { useChangeAppointmentState } from "@/services/appointments/appointmentMutation";
import { useRouter } from "next/navigation";
import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";

interface PastAppointmentCardProps {
  appointment: TAppointment;
}

export default function PastAppointmentCard({
  appointment,
}: PastAppointmentCardProps) {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<AppointmentState | null>(null);

  const { mutate: updateAppointment, isPending: isUpdateAppointment } =
    useChangeAppointmentState();
  const { refresh } = useRouter();

  const statusOptions: AppointmentState[] = [
    AppointmentState.CONFIRMED,
    AppointmentState.CANCELLED,
    AppointmentState.DIDNOTATTEND,
    AppointmentState.ARRIVED,
    AppointmentState.INSURGERY,
  ];

  const handleStatusChange = () => {
    if (!selectedStatus) return;
    updateAppointment(
      {
        appointment: { state: selectedStatus },
        id: appointment.id,
        dentistId: appointment.practitionerId
      },
      {
        onSuccess: (data) => {
          console.log("updated appointment ", data);
          refresh();
          setIsConfirmModalOpen(false);
          setMenuOpen(false);
        }, onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
          setIsConfirmModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-1 p-6 rounded-2xl bg-gray">
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
            <Image src={TimeIconV2} alt="Time Icon" className="w-4 h-4" />
            <p className="text-lg">
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.finishTime)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xl font-medium truncate">
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

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-1 items-center">
          <p className="text-lg flex gap-1 items-center">
            Status: <StatusBage status={appointment.state} />
          </p>
        </div>
        <div className="relative">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="w-full relative flex gap-1 items-center focus:outline-none">
              <p className="text-green text-lg font-semibold cursor-pointer">
                Select Status:
              </p>
              <Image
                src={DropDownIcon}
                alt="Dropdown icon"
                className="w-3 h-3"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[200px] absolute top-14 border border-green rounded-lg bg-white"
              align="end"
            >
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${appointment.state === status ? "bg-green-50" : ""
                    }`}
                  onClick={() => {
                    setSelectedStatus(status);
                    setIsConfirmModalOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  {capitalize(status)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-between items-center mt-7">
        <CustomButton
          text="See Reports"
          href={`/dentist/appointments/${appointment.id}/reports`}
        />
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setMenuOpen(false);
        }}
        isPending={isUpdateAppointment}
        onConfirm={handleStatusChange}
        title="Change Appointment Status"
        description={`Are you sure you want to set status to "${capitalize(
          selectedStatus || ""
        )}"?`}
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}
