"use client";

import { TAppointment } from "@/types/appointment";
import { format } from "date-fns";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";

interface AppointmentListItemProps {
  appointment: TAppointment;
  onSelect: (appointmentId: string, practitionerId: number) => void;
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
        onClick={async () => {
          if (isLoading) return;

          try {
            onSelect(String(appointment.id), appointment.practitionerId);
          } catch (error) {
            console.error("Error completing process:", error);
          }
        }}
        className="ml-4 px-4 py-2 bg-green text-dashboardBarBackground rounded-full text-sm font-medium hover:bg-greenHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isLoading ? "Binding..." : "Select"}
      </button>
    </div>
  );
}
