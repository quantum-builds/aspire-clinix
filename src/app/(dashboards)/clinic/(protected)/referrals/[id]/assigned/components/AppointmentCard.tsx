import Button from "@/app/(dashboards)/components/Button";
import { CalenderGreenIcon, TimeIcon } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

export default function AssignedAppointmentCard({
  appointment,
}: {
  appointment: TAppointment;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-10">
      <p className="font-medium text-2xl">Appointment</p>
      <div className="lg50:w-3/4 1xl:w-2/3 2xl:w-1/2">
        <div
          className="border border-green rounded-2xl p-6 space-y-8"
          key={appointment.id}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-dashboardTextBlack font-medium text-2xl">
                Appointment
              </p>
              <div className="flex gap-3 items-center">
                <p className="flex items-center gap-2 text-xl">
                  <Image src={CalenderGreenIcon} alt="Calender Icon" />
                  {formatDate(appointment.date)}
                </p>
                <p className="flex items-center gap-2 text-xl">
                  <Image src={TimeIcon} alt="Time icon" />
                  {formatTime(appointment.startTime)}{" "} - {" "}{formatTime(appointment.finishTime)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="italic text-green font-medium text-xl">
                Status: {appointment.state}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <Button text="See reports" href={`/dentist/appointments/${appointment.id}/reports`} />
            <p className="font-medium italic text-xl text-green">
              Assigned to {appointment.dentist.fullName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
