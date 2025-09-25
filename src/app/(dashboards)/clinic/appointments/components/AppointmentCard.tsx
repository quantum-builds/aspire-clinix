import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TAppointmentClinic } from "@/types/common";
import Image from "next/image";

interface UpcomingAppointmentCardProps {
  appointment: TAppointmentClinic;
  type: "past" | "upcoming";
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
                <p className="text-lg">{appointment.date}</p>
              </div>
              {type === "upcoming" && (
                <div className="flex items-center gap-1">
                  <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
                  <p className="text-lg">{appointment.time}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {type === "upcoming" && (
          <div className="text-lg italic flex w-full justify-end">
            Appointment # {appointment.appointmentNumber}
          </div>
        )}
      </div>
      <div className={`flex ${type === "past" && "justify-between"}`}>
        <div className="space-y-3 flex-1">
          <p className="text-lg">
            Name: <span className="font-medium">{appointment.patientName}</span>
          </p>
          <p className="text-lg">
            Age:
            <span className="font-medium">{appointment.patientAge}</span>
          </p>
        </div>
        <div className={`space-y-3 flex-1 ${"text-right"}`}>
          <p className="text-lg">
            Gender:{" "}
            <span className="font-medium">{appointment.patientGender}</span>
          </p>
          <p className="text-lg">
            Disease: <span className="font-medium">{appointment.disease}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <Button
            text="See Reports"
            href={`/clinic/appointments/reports/${appointment.appointmentNumber}`}
          />
        </div>
        <div className="text-right">
          <p className="text-green font-medium italic">
            {appointment.dentistName}
          </p>
        </div>
      </div>
    </div>
  );
}
