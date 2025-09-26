import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { calculateAge, formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function PastAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBackground">
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
            <div className="flex items-center gap-1">
              <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
              <p className="text-lg">
                {formatTime(appointment.date)}-{formatTime(appointment.date)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-row-2 gap-y-5 gap-x-5">
        <div className="flex items-start  gap-2">
          <p className="flex-[50%] text-lg">
            Name:{" "}
            <span className="font-medium">{appointment.patient.fullName}</span>
          </p>
          <p className="flex-[50%] text-lg text-right">
            Disease: <span className="font-medium">{appointment.reason}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="flex-[60%] text-lg">
            Phone No:{" "}
            <span className="font-medium">
              {appointment.patient.phoneNumber}
            </span>
          </p>
          <p className="flex-[40%] text-lg text-right">
            Age:
            <span className="font-medium">
              {calculateAge(appointment.patient.dateOfBirth)}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button
          text="See Reports"
          href={`/dentist/appointments/${appointment.id}/reports`}
        />
        <p className="text-lg italic text-right ">
          Appointment # {appointment.id}
        </p>
      </div>
    </div>
  );
}
