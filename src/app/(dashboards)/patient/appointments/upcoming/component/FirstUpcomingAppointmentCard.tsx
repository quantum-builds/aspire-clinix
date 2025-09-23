import Button from "@/app/(dashboards)/components/Button";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TUpcomingAppointmentPatient } from "@/types/common";
import Image from "next/image";

interface FirstUpcomingAppointmentCardProps {
  appointment: TUpcomingAppointmentPatient;
}
export default function FirstUpcomingAppointmentCard({
  appointment,
}: FirstUpcomingAppointmentCardProps) {
  return (
    <div className="w-full flex flex-col gap-10 bg-dashboardBarBackground p-6 rounded-2xl">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-2xl">Upcoming Appointments</p>
          <p className="text-xl ">
            Status: <span className="font-medium italic">Pending</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 items-end">
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
        <div className="grid grid-row-3 gap-y-5 gap-x-5">
          {/* First column - 2 items */}
          <div className="flex items-center gap-2  text-xl">
            <p className="flex-[25%] ">
              Name:{" "}
              <span className="font-medium">{appointment.dentistName}</span>
            </p>
            <p className="flex-[25%]">
              GDC no:{" "}
              <span className="font-medium">{appointment.gdcNumber}</span>
            </p>
            <p className="flex-[50%]">
              Disease:{" "}
              <span className="font-medium">{appointment.disease}</span>
            </p>
          </div>

          {/* Second column - 3 items */}
          <div className="flex items-ceter gap-2">
            <p className="flex-[25%] text-xl">
              Phone:{" "}
              <span className="font-medium">{appointment.dentistPhone}</span>
            </p>
            <p className="flex-[25%] text-xl">
              Email:{" "}
              <span className="font-medium">{appointment.dentistEmail}</span>
            </p>
            <p className="flex-[50%] text-xl">
              Practice Address:{" "}
              <span className="font-medium">{appointment.practiceAddress}</span>
            </p>
          </div>
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
            Appointment with {appointment.dentistName}
          </p>
          <p className="text-green text-right">{appointment.specialization}</p>
        </div>
      </div>
    </div>
  );
}
