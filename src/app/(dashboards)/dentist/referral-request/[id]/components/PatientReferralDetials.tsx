import { CalenderGreenIcon } from "@/assets";
import Image from "next/image";

interface PatientReferralDetailsProps {
  patientDetials: {
    name: string;
    gender: string;
    phone: string;
    email: string;
    disease: string;
  };
  dentistDetails: {
    date: string;
    name: string;
    gdcNo: string;
    phone: string;
    email: string;
    address: string;
  };
}

export default function PatientReferralDetails({
  patientDetials,
  dentistDetails,
}: PatientReferralDetailsProps) {
  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <p className="font-medium text-dashboardTextBlack text-2xl">
        Patient & Referral Dentist Details
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray p-6 space-y-5 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl">Patient Details</p>
            <p className="italic text-green text-xl">
              Reference Number: REF 112100
            </p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Name: {patientDetials.name}</p>
            <p className="flex-1">Gender: {patientDetials.gender}</p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>Disease: {patientDetials.disease}</p>
          </div>
        </div>
        <div className="bg-gray p-6 space-y-5 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl">
              Referral Dentist Details
            </p>
            <p className="text-xl flex items-center gap-2">
              <Image src={CalenderGreenIcon} alt="Calender Icon" />
              {dentistDetails.date}
            </p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Name: {dentistDetails.name}</p>
            <p className="flex-1">GDC no.: {dentistDetails.gdcNo}</p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Phone: {dentistDetails.phone}</p>
            <p className="flex-1">Email: {dentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>Practice Address: {dentistDetails.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
