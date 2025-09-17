import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TUpcomingAppointmentPatient } from "@/types/common";
import Image from "next/image";

interface UpcomingAppointmentCardProps {
  appointment: TUpcomingAppointmentPatient;
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
              <p className="text-xl">{appointment.date}</p>
            </div>
            <div className="flex items-center gap-1">
              <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
              <p className="text-xl">{appointment.time}</p>
            </div>
          </div>
          <p className="text-xl italic">
            Appointment Number: {appointment.appointmentNumber}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium text-green">Dentist Details</p>
        <div className="grid grid-cols-2 gap-y-5 gap-x-5">
          <p className=" text-xl">
            Name: <span className="font-medium">{appointment.dentistName}</span>
          </p>
          <p className=" text-xl">
            GDC no: <span className="font-medium">{appointment.gdcNumber}</span>
          </p>
          <p className="text-xl">
            Phone:{" "}
            <span className="font-medium">{appointment.dentistPhone}</span>
          </p>
          <p className=" text-xl">
            Disease: <span className="font-medium">{appointment.disease}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button text="See Reports" href="/patient/appointments/reports" />
        <div className="flex flex-col gap-1">
          <p className="text-green text-right">
            Appointment with {appointment.dentistName}
          </p>
          <p className="text-green text-right">{appointment.specialization}</p>
        </div>
      </div>
    </div>
  );
}
