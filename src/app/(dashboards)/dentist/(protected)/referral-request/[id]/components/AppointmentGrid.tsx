import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import { AppointmentDetails } from "@/types/common";
import Image from "next/image";

interface AppointmentGridProps {
  appointments: AppointmentDetails[];
}

export default function AppointmentGrid({
  appointments,
}: AppointmentGridProps) {
  return (
    <div className="bg-dashboardBarBackground rounded-2xl p-6 space-y-3">
      <p className="text-dashboardTextBlack text-[22px] font-medium">
        Appointment
      </p>
      <div className="grid xl:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <div
            className="px-5 py-4 rounded-2xl p-6 space-y-6 bg-gray"
            key={appointment.appointmentNumber}
          >
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="flex items-center gap-2 text-[17px]">
                  <Image src={CalenderInputIconV2} alt="Calender Icon" />
                  {appointment.date}
                </p>

                <div className="flex gap-3 items-center">
                  <p className="flex items-center gap-2 text-[17px]">
                    <Image src={TimeIconV2} alt="Time icon" />
                    {appointment.time} - 1:30 PM
                  </p>
                </div>
              </div>
              <div className="space-y-1 flex items-center justify-between">
                <p className="text-dashboardTextBlack font-medium text-xl italic">
                  Appointment # {appointment.appointmentNumber}
                </p>
                <p className="text-green font-medium text-[17px] flex gap-1 items-center">
                  Status: <StatusBage status={"PENDING"} />
                </p>
              </div>
            </div>
            <div className="flex w-1/2">
              <CustomButton
                text="See reports"
                href="/dentist/appointments/reports"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
