import Button from "@/app/(dashboards)/components/Button";
import { CalenderGreenIcon, TimeIcon } from "@/assets";
import { AppointmentDetails } from "@/types/common";
import Image from "next/image";

interface AppointmentGridProps {
  appointments: AppointmentDetails[];
  appointmentType: "past" | "upcoming";
}

export default function AppointmentGrid({
  appointments,
  appointmentType,
}: AppointmentGridProps) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-10">
      <p className="text-dashboardTextBlack text-2xl font-medium">
        {appointmentType === "past" ? "Past" : "Upcoming"} Appointments
      </p>
      <div className="grid grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <div
            className={`${
              appointmentType === "upcoming" ? "border border-green" : "bg-gray"
            } rounded-2xl p-6 space-y-8`}
            key={appointment.appointmentNumber}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-dashboardTextBlack font-medium text-2xl">
                  Appointment
                </p>
                <div className="flex gap-3 items-center">
                  <p className="flex items-center gap-2 text-xl">
                    <Image src={CalenderGreenIcon} alt="Calender Icon" />
                    {appointment.date}
                  </p>
                  <p className="flex items-center gap-2 text-xl">
                    <Image src={TimeIcon} alt="Time icon" />
                    {appointment.time}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="italic text-green font-medium text-xl">
                  Status: {appointment.status}
                </p>
                <p className="italic font-mediium text-xl text-dashboardTextBlack">
                  Appointment Number: {appointment.appointmentNumber}
                </p>
              </div>
            </div>
            <div className="flex w-1/2">
              <Button text="See reports" href="/dentist/appointments/reports" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
