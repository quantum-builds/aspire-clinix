import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TPastAppointmentPatient } from "@/types/common";
import Image from "next/image";
import Button from "@/app/(dashboards)/components/Button";

interface UpcomingAppointmentCardProps {
  appointment: TPastAppointmentPatient;
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
            <p className="text-lg">{appointment.date}</p>
          </div>
          <div className="flex items-center gap-1">
            <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
            <p className="text-lg">{appointment.time}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-y-5 justify-between">
        <p className="text-lg">
          Name: <span className="font-medium">{appointment.dentistName}</span>
        </p>
        <p className="text-lg">
          GDC no: <span className="font-medium">{appointment.gdcNumber}</span>
        </p>
        <p className="text-lg">
          Phone: <span className="font-medium">{appointment.dentistPhone}</span>
        </p>
        <p className="text-lg">
          Disease: <span className="font-medium">{appointment.disease}</span>
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Button text="See Reports" href="/patient/appointments/reports" />
        <p className="text-lg italic text-right">
          Appointment.no: {appointment.appointmentNumber}
        </p>
      </div>
    </div>
  );
}
