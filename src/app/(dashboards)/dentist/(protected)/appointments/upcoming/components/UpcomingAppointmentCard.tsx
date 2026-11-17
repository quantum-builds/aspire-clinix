"use client";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import { CalenderInputIconV2, DropDownIcon, TimeIconV2 } from "@/assets";
import { useChangeAppointmentState } from "@/services/appointments/appointmentMutation";
import { AppointmentState, TAppointment } from "@/types/appointment";
import { formatDate } from "@/utils/formatDateTime";
import { capitalize } from "@/utils/formatWords";
import { TIMEZONE } from "@/utils/slotSelectionUtils";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentState | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const { refresh } = useRouter();

  // Close the status menu when clicking outside it
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);
  const { mutate: updateAppointment, isPending: updateAppointmentLoader } =
    useChangeAppointmentState();

  const statusOptions: AppointmentState[] = [
    AppointmentState.CONFIRMED,
    AppointmentState.PENDING,
    AppointmentState.CANCELLED,
  ];

  const handleStatusChange = () => {
    if (!selectedStatus) return;
    updateAppointment(
      {
        appointment: { state: selectedStatus },
        id: appointment.id,
        dentistId: appointment.practitionerId,
      },
      {
        onSuccess: () => {
          refresh();
          setIsConfirmModalOpen(false);
          setMenuOpen(false);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
          setIsConfirmModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 p-5 rounded-2xl bg-gray">
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

      <div className="flex items-center justify-between">
        <p className="text-lg flex gap-1 items-center">
          Status: <StatusBage status={appointment.state} />
        </p>
        <div className="relative">
          {/* Rendered inline (no portal): the global `html { zoom }` in globals.css
              breaks Radix's portal positioning, so the menu sits under the trigger here. */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              className="relative flex gap-1 items-center focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <p className="text-green text-lg font-semibold cursor-pointer">
                Select Status:
              </p>
              <Image
                src={DropDownIcon}
                alt="Dropdown icon"
                className={`w-3 h-3 transition-transform duration-300 ${menuOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {menuOpen && (
              <div className="absolute left-0 top-full mt-[5px] min-w-full w-max border border-green rounded-lg bg-white z-50 p-1 shadow-md">
                {statusOptions.map((status) => (
                  <div
                    key={status}
                    className={`px-3 py-2 rounded-sm text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                      appointment.state === status ? "bg-green-50" : ""
                    }`}
                    onClick={() => {
                      setSelectedStatus(status);
                      setIsConfirmModalOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    {capitalize(status)}
                  </div>
                ))}
              </div>
            )}
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
                {formatInTimeZone(
                  new Date(appointment.startTime),
                  TIMEZONE,
                  "HH:mm",
                )}{" "}
                -{" "}
                {formatInTimeZone(
                  new Date(appointment.finishTime),
                  TIMEZONE,
                  "HH:mm",
                )}
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
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setMenuOpen(false);
        }}
        isPending={updateAppointmentLoader}
        onConfirm={handleStatusChange}
        title="Change Appointment Status"
        description={`Are you sure you want to set status to "${capitalize(
          selectedStatus || "",
        )}"?`}
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}
