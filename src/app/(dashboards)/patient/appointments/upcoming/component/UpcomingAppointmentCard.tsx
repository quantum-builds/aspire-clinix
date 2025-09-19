import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBarBackground">
      <div className="flex justify-between">
        <p className="font-medium text-2xl">Next Appointment</p>
        <div className="flex flex-col gap-3  items-end">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Image
                src={CalenderInputIcon}
                alt="Calendar Icon"
                className="w-4 h-4"
              />
              <p className="text-xl">{formatDate(appointment.date)}</p>
            </div>
            <div className="flex items-center gap-1">
              <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
              <p className="text-xl">{formatTime(appointment.date)}</p>
            </div>
          </div>
          <p className="text-xl italic">Appointment Number: {appointment.id}</p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium text-green">Dentist Details</p>
        <div className="grid grid-cols-2 gap-y-5 gap-x-5">
          <p className=" text-xl">
            Name:{" "}
            <span className="font-medium">{appointment.dentist.fullName}</span>
          </p>
          <p className=" text-xl">
            GDC no:{" "}
            <span className="font-medium">{appointment.dentist.gdcNo}</span>
          </p>
          <p className="text-xl">
            Phone:{" "}
            <span className="font-medium">
              {appointment.dentist.phoneNumber}
            </span>
          </p>
          <p className=" text-xl">
            Disease: <span className="font-medium">{appointment.reason}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          text="See Reports"
          href={`/patient/appointments/${appointment.id}/reports`}
        />
        <p className="text-green text-right">
          Appointment with {appointment.dentist.fullName}
        </p>
      </div>
    </div>
  );
}
