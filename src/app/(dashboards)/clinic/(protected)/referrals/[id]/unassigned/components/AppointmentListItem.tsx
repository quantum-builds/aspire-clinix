"use client";

import { TAppointment } from "@/types/appointment";
import { format } from "date-fns";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";

interface AppointmentListItemProps {
  appointment: TAppointment;
  onSelect: (
    appointmentId: string,
    practitionerId: number,
    action: "bind" | "unbind",
  ) => void;
  isLoading?: boolean;
}

export default function AppointmentListItem({
  appointment,
  onSelect,
  isLoading = false,
}: AppointmentListItemProps) {
  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.finishTime);

  const formatDate = (date: Date) => format(date, "MMM d, yyyy");
  const formatTime = (date: Date) => format(date, "h:mm a");

  const isBound = appointment.bindStatus === "BOUND";

  return (
    <div className="flex items-center justify-between p-4 bg-gray rounded-xl hover:bg-lightGray transition-colors border border-transparent hover:border-green">
      <div className="flex flex-col gap-2 flex-1">
        {/* Date and Time Row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-dashboardTextBlack">
            <Calendar className="w-4 h-4 text-green" />
            <span className="font-medium">{formatDate(startDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-dashboardTextBlack">
            <Clock className="w-4 h-4 text-green" />
            <span>
              {formatTime(startDate)} - {formatTime(endDate)}
            </span>
          </div>
        </div>

        {/* Dentist and Duration Row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-dashboardTextBlack">
            <User className="w-4 h-4 text-green" />
            <span>{appointment.practitionerName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="text-xs bg-dashboardBackground px-2 py-0.5 rounded">
              {appointment.duration} min
            </span>
          </div>
        </div>

        {/* Reason Row */}
        <div className="flex items-center gap-1.5 text-sm text-dashboardTextBlack">
          <Stethoscope className="w-4 h-4 text-green" />
          <span className="truncate max-w-[250px]">{appointment.reason}</span>
        </div>
      </div>

      {/* Select Button */}
      <button
        disabled={isLoading}
        onClick={() => {
          if (isLoading) return;

          try {
            onSelect(
              String(appointment.id),
              appointment.practitionerId,
              isBound ? "unbind" : "bind",
            );
          } catch (error) {
            console.error("Error completing process:", error);
          }
        }}
        className={`ml-4 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap ${
          isBound
            ? "bg-dashboardBackground text-dashboardTextBlack hover:bg-gray"
            : "bg-green text-dashboardBarBackground hover:bg-greenHover"
        }`}
      >
        {isLoading
          ? isBound
            ? "Unbinding..."
            : "Binding..."
          : isBound
            ? "Unbind"
            : "Bind"}
      </button>
    </div>
  );
}
