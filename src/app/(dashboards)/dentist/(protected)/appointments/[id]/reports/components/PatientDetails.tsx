import { CalenderInputIcon, TimeIcon } from "@/assets";
import { TPatient } from "@/types/patient";
import { calculateAge } from "@/utils/formatDateTime";
import Image from "next/image";

interface DentistDetailsProps {
  patientDetails?: TPatient;
}

export default function DentistDetails({
  patientDetails,
}: DentistDetailsProps) {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBarBackground rounded-2xl p-6">
      <div className="space-y-2">
        <div className="w-full flex items-center justify-between gap-2">
          <p className="font-medium text-2xl">Appointment</p>
        </div>
      </div>
      {patientDetails && (
        <div className="flex flex-col gap-5">
          <p className="text-2xl font-medium text-green">Patient Details</p>
          <div className="grid grid-row-2 gap-y-5 gap-x-5">
            {/* First column - 2 items */}
            <div className="flex items-center gap-2">
              <p className="flex-[20%] text-xl">
                Name:{" "}
                <span className="font-medium">{patientDetails.fullName}</span>
              </p>
              <p className="flex-[20%] text-xl">
                Age:{" "}
                <span className="font-medium">
                  {calculateAge(patientDetails.dateOfBirth || new Date())}
                </span>
              </p>

              <div className="flex-[30%] text-xl text-left truncate">
                Email:{" "}
                <span className="font-medium">{patientDetails.email}</span>
              </div>
            </div>

            {/* Second column - 3 items */}
            <div className="flex items-ceter gap-2">
              <p className="flex-[25%] text-xl">
                Phone:{" "}
                <span className="font-medium">
                  {patientDetails.phoneNumber}
                </span>
              </p>
              <p className="flex-[25%] text-xl">
                Gender:{" "}
                <span className="font-medium">{patientDetails.gender}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
