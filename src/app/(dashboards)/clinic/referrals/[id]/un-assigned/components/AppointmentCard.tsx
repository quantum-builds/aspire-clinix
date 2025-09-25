import Button from "@/app/(dashboards)/components/Button";
import { CalenderGreenIcon, TimeIcon } from "@/assets";
import { AppointmentDetails } from "@/types/common";
import Image from "next/image";

export default function AssignedAppointmentCard({
  appointment,
}: {
  appointment: AppointmentDetails;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-10">
      <p className="font-medium text-2xl">Appointment</p>
      <div className="w-full">
        <div
          className="border border-green rounded-2xl p-6 space-y-8"
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
                Appointment # {appointment.appointmentNumber}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <Button text="See reports" href="/dentist/appointments/reports" />
            <p className="font-medium italic text-xl text-green">
              Assigned to Dr. Kavin Smith
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
