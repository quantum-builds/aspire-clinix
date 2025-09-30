import { CalenderInputIconV2, CloseIcon, TimeIconV2 } from "@/assets";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TAppointment } from "@/types/appointment";
import { calculateAge, formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";

export default function PatientDetailsModal({
  onClose,
  trigger,
  open,
  appointment,
}: {
  onClose: () => void;
  trigger?: React.ReactNode;
  open: boolean;
  appointment: TAppointment;
}) {
  return (
    <Dialog open={open}>
      <DialogTrigger className="focus:outline-none">
        {trigger && trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[588px] rounded-2xl p-6 space-y-3   focus:outline-none">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-green text-2xl">
            Appointment Details
          </p>
          <div
            className="size-11 cursor-pointer flex justify-center items-center bg-gray rounded-full"
            onClick={onClose}
          >
            <Image src={CloseIcon} alt="close" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xl font-semibold text-green mb-3">
            Patient Details
          </p>
          <div>
            <div className="flex items-center">
              <p className="flex-1">
                Name:{" "}
                <span className="font-medium text-lg">
                  {appointment.patient.fullName}
                </span>
              </p>
              <p className="flex-1">
                Age:{" "}
                <span className="font-medium text-lg">
                  {calculateAge(appointment.patient.dateOfBirth!)} years
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="flex-1">
                Email:{" "}
                <span className="font-medium text-lg">
                  {appointment.patient.email}
                </span>
              </p>
              <p className="flex-1">
                Phone:{" "}
                <span className="font-medium text-lg">
                  {appointment.patient.phoneNumber}
                </span>
              </p>
            </div>
            <div>
              <p>
                Reason:{" "}
                <span className="font-medium text-lg">
                  {appointment.reason}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xl font-semibold text-green mb-3">
            Appointment Date & Time
          </p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Image src={CalenderInputIconV2} alt="Calender Icon" />
              <p>
                {" "}
                Date:{" "}
                <span className="font-medium text-lg">
                  {formatDate(appointment.date)}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <Image src={TimeIconV2} alt="Time Icon" />
              <p>
                {" "}
                Time:{" "}
                <span className="font-medium text-lg">
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.finishTime)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
