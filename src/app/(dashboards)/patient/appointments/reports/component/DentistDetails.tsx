import { TDentistDeatils } from "@/types/common";
import { CalenderInputIcon, TimeIcon } from "@/assets";
import Image from "next/image";

interface DentistDetailsProps {
  dentistDetails: TDentistDeatils;
}

export default function DentistDetails({
  dentistDetails,
}: DentistDetailsProps) {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBarBackground rounded-2xl p-6">
      <div className="w-full flex items-center justify-between gap-2">
        <p className="font-medium text-2xl">Assigned Doctor</p>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Image
                src={CalenderInputIcon}
                alt="Calendar Icon"
                className="w-4 h-4"
              />
              <p className="text-xl">{dentistDetails.date}</p>
            </div>
            <div className="flex items-center gap-1">
              <Image src={TimeIcon} alt="TIme Icon" className="w-4 h-4" />
              <p className="text-xl">{dentistDetails.time}</p>
            </div>
          </div>
          <p className="text-xl italic">
            Appointment Number: {dentistDetails.appointmentNumber}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium text-green">Dentist Details</p>
        <div className="grid grid-row-2 gap-y-5 gap-x-5">
          {/* First column - 2 items */}
          <div className="flex items-center gap-2">
            <p className="flex-[25%] text-xl">
              Name: <span className="font-medium">{dentistDetails.name}</span>
            </p>
            <p className="flex-[25%] text-xl">
              GDC no:{" "}
              <span className="font-medium">{dentistDetails.gdcNo}</span>
            </p>
            <div className="flex-[50%]"></div>
          </div>

          {/* Second column - 3 items */}
          <div className="flex items-ceter gap-2">
            <p className="flex-[25%] text-xl">
              Phone:{" "}
              <span className="font-medium">{dentistDetails.phoneNo}</span>
            </p>
            <p className="flex-[25%] text-xl">
              Email: <span className="font-medium">{dentistDetails.email}</span>
            </p>
            <p className="flex-[50%] text-xl">
              Practice Address:{" "}
              <span className="font-medium">
                {dentistDetails.practiceAddress}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
