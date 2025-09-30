import { CalenderInputIconV2, TimeIconV2 } from "@/assets";
import Image from "next/image";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";

interface UpcomingAppointmentCardProps {
  appointment: TAppointment;
}

export default function PastAppointmentCard({
  appointment,
}: UpcomingAppointmentCardProps) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-dashboardBackground">
      <div className="flex justify-between gap-3 items-center">
        <p className="text-green font-semibold text-xl">Dentist Details</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Image
              src={CalenderInputIconV2}
              alt="Calendar Icon"
              className="w-4 h-4"
            />
            <p className="text-lg">{formatDate(appointment.date)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Image src={TimeIconV2} alt="TIme Icon" className="w-4 h-4" />
            <p className="text-lg">
              {" "}
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.finishTime)}
            </p>
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex items-center justify-between">
          <p className="text-lg">
            Name:{" "}
            <span className="font-medium truncate">
              {appointment.dentist.fullName}{" "}
            </span>
          </p>
          <p className="text-lg">
            Age: <span className="font-medium">{20} years</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg">
            Gender:{" "}
            <span className="font-medium">{appointment.patient.gender}</span>
          </p>
          <p className="text-lg">
            Reason:{" "}
            <span className="font-medium truncate">{appointment.reason}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <CustomButton
          text="See Reports"
          href={`/patient/appointments/${appointment.id}/reports`}
        />
      </div>
    </div>
  );
}
