import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

interface FirstUpcomingAppointmentCardProps {
  appointment: TAppointment;
}
export default function FirstUpcomingAppointmentCard({
  appointment,
}: FirstUpcomingAppointmentCardProps) {
  return (
    <div className="w-full flex flex-col gap-10 bg-dashboardBarBackground p-6 rounded-2xl">
      <div className="space-y-3">
        <div className="flex gap-3 justify-between items-center">
          <p className="font-medium text-2xl">Upcoming Appointments</p>
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
        </div>
        <div className="flex  gap-3 items-center justify-between">
          <p className="text-xl ">
            Status: <span className="font-medium italic">Pending</span>
          </p>

          <p className="text-xl italic">Appointment # {appointment.id}</p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium text-green">Dentist Details</p>
        <div className="grid grid-row-3 gap-y-5 gap-x-5">
          <div className="flex items-start max-1xl:justify-between gap-2 text-xl">
            <div className="1xl:flex-[25%] space-y-5">
              <p>
                Name:{" "}
                <span className="font-medium">
                  {appointment.dentist.fullName}
                </span>
              </p>
              <p className="text-xl">
                Phone:{" "}
                <span className="font-medium">
                  {appointment.dentist.phoneNumber}
                </span>
              </p>
            </div>
            <div className="1xl:flex-[30%] space-y-5">
              <p>
                GDC no:{" "}
                <span className="font-medium">{appointment.dentist.gdcNo}</span>
              </p>
              <p className="text-xl">
                Email:{" "}
                <span className="font-medium">{appointment.dentist.email}</span>
              </p>
            </div>
            <div>
              <p>
                Disease:{" "}
                <span className="font-medium">{appointment.reason}</span>
              </p>
            </div>
          </div>

          <p className=" text-xl">
            Practice Address:{" "}
            <span className="font-medium">
              {appointment.dentist.practiceAddress}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button text="See Reports" href="/patient/appointments/reports" />
          <button className="h-[60px] px-6 py-3 font-medium text-lg rounded-full bg-gray">
            Cancel Appoinment
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-green text-right">
            Appointment with Dr. Will Smith
          </p>
          <p className="text-green text-right">Prosthodontist</p>
        </div>
      </div>
    </div>
  );
}
