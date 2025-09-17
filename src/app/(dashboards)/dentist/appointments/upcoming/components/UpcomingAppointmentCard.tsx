import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TAppointmentDentist } from "@/types/common";
import Image from "next/image";

interface UpcomingAppointmentCardProps {
  appointment: TAppointmentDentist;
}

export default function UpcomingAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBackground">
      <div className="flex justify-between">
        <p className="font-medium text-2xl text-green">Patient Details</p>
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
        </div>
      </div>
      <div className="grid grid-row-2 gap-y-5 gap-x-5">
        <div className="flex items-center">
          <p className="flex-[40%] text-xl">
            Name: <span className="font-medium">{appointment.patientName}</span>
          </p>
          <p className="flex-[60%] text-xl">
            Disease: <span className="font-medium">{appointment.disease}</span>
          </p>
        </div>
        <div className="flex items-center">
          <p className="flex-[40%] text-xl">
            Phone No:{" "}
            <span className="font-medium">{appointment.patientPhone}</span>
          </p>
          <p className="flex-[30%] text-xl">
            Age:
            <span className="font-medium">{appointment.patientAge}</span>
          </p>
          <p className="flex-[30%] text-xl">
            Gender:
            <span className="font-medium">{appointment.patientGender}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button text="See Reports" href="/dentist/appointments/reports" />
        <p className="text-xl italic">
          Appointment Number: {appointment.appointmentNumber}
        </p>
      </div>
    </div>
  );
}
