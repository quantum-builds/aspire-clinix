import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { AppointmentDateType, TAppointmentClinic } from "@/types/common";
import { calculateAge, formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
  type: AppointmentDateType;
}

export default function UpcomingAppointmentCard({
  appointment,
  type,
}: UpcomingAppointmentCardProps) {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBackground">
      <div>
        <div className="flex justify-between">
          <p className="font-medium text-xl text-green">Patient Details</p>
          <div className="flex flex-col gap-3  items-end">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Image
                  src={CalenderInputIcon}
                  alt="Calendar Icon"
                  className="w-4 h-4"
                />
                <p className="text-lg">{formatDate(appointment.date)}</p>
              </div>
              {type === AppointmentDateType.UPCOMING && (
                <div className="flex items-center gap-1">
                  <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
                  <p className="text-lg">{formatTime(appointment.date)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {type === AppointmentDateType.UPCOMING && (
          <div className="text-lg italic flex w-full justify-end">
            Appointment # {appointment.id}
          </div>
        )}
      </div>
      <div
        className={`flex ${
          type === AppointmentDateType.PAST && "justify-between"
        }`}
      >
        <div className="space-y-3 flex-1">
          <p className="text-lg">
            Name:{" "}
            <span className="font-medium">{appointment.patient.fullName}</span>
          </p>
          <p className="text-lg">
            Age:
            <span className="font-medium">
              {calculateAge(appointment.patient.dateOfBirth)}
            </span>
          </p>
        </div>
        <div className={`space-y-3 flex-1 ${"text-right"}`}>
          <p className="text-lg">
            Gender:{" "}
            <span className="font-medium">
              {appointment.patient.gender.toLowerCase()}
            </span>
          </p>
          <p className="text-lg">
            Disease: <span className="font-medium">{appointment.reason}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <Button
            text="See Reports"
            href={`/clinic/appointments/${appointment.id}/reports`}
          />
        </div>
        <div className="text-right">
          <p className="text-green font-medium italic">
            {appointment.dentist.fullName}
          </p>
        </div>
      </div>
    </div>
  );
}
