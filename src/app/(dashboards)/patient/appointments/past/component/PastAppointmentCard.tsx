import { CalenderInputIcon } from "@/assets";
import Image from "next/image";
import Button from "@/app/(dashboards)/components/Button";
import { TAppointment } from "@/types/appointment";
import { formatDate } from "@/utils/formatDateTime";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function PastAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBackground">
      <div className="flex justify-between gap-3 items-center">
        <p className="text-green font-medium text-xl">Dentist Details</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Image
              src={CalenderInputIcon}
              alt="Calendar Icon"
              className="w-4 h-4"
            />
            <p className="text-xl">{formatDate(appointment.date)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-lg">
            Name:{" "}
            <span className="font-medium truncate">
              {appointment.dentist.fullName}{" "}
            </span>
          </p>
          <p className="text-lg">
            Age: <span className="font-medium">{20} years</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg">
            Gender:{" "}
            <span className="font-medium">{appointment.patient.gender}</span>
          </p>
          <p className="text-lg">
            Disease:{" "}
            <span className="font-medium truncate">{appointment.reason}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          text="See Reports"
          href={`/patient/appointments/${appointment.id}/reports`}
        />
        <p className="text-lg text-green font-medium text-right">
          {appointment.dentist.fullName}
        </p>
      </div>
    </div>
  );
}
