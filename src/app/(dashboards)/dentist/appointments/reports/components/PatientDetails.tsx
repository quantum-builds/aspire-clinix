import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TPatientDetails } from "@/types/common";
import Image from "next/image";

interface DentistDetailsProps {
  patientDetails: TPatientDetails;
}

export default function DentistDetails({
  patientDetails,
}: DentistDetailsProps) {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBarBackground rounded-2xl p-6">
      <div className="w-full flex items-center justify-between gap-2">
        <p className="font-medium text-2xl">Appointment</p>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Image
                src={CalenderInputIcon}
                alt="Calendar Icon"
                className="w-4 h-4"
              />
              <p className="text-xl">{patientDetails.date}</p>
            </div>
            <div className="flex items-center gap-1">
              <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
              <p className="text-xl">{patientDetails.time}</p>
            </div>
          </div>
          <p className="text-xl italic">
            Appointment Number: {patientDetails.appointmentNumber}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium text-green">Patient Details</p>
        <div className="grid grid-row-2 gap-y-5 gap-x-5">
          {/* First column - 2 items */}
          <div className="flex items-center gap-2">
            <p className="flex-[25%] text-xl">
              Name:{" "}
              <span className="font-medium">{patientDetails.patientName}</span>
            </p>
            <p className="flex-[25%] text-xl">
              Disease:{" "}
              <span className="font-medium">{patientDetails.disease}</span>
            </p>
            <div className="flex-[50%] text-xl">
              Email:{" "}
              <span className="font-medium">{patientDetails.patientEmail}</span>
            </div>
          </div>

          {/* Second column - 3 items */}
          <div className="flex items-ceter gap-2">
            <p className="flex-[25%] text-xl">
              Gender:{" "}
              <span className="font-medium">
                {patientDetails.patientGender}
              </span>
            </p>
            <p className="flex-[25%] text-xl">
              Age:{" "}
              <span className="font-medium">{patientDetails.patientAge}</span>
            </p>
            <p className="flex-[50%] text-xl">
              Phone:{" "}
              <span className="font-medium">{patientDetails.patientPhone}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
