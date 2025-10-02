import { CalenderInputIconV2 } from "@/assets";
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
    <div className="bg-dashboardBarBackground w-full rounded-2xl px-6 py-6 space-y-3">
      <p className="font-medium text-dashboardTextBlack text-[22px]">
        Patient & Referral Dentist Details
      </p>
      <div className="grid xl:grid-cols-2 gap-3">
        <div className="bg-gray px-5 py-4 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-green font-semibold text-xl">Patient Details</p>
            <p className="italic text-green text-[17px] text-right">
              Reference # REF 112100
            </p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Name: {patientDetials.name}</p>
            <p className="flex-1">Gender: {patientDetials.gender}</p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-[17px]">
            <p>Disease: {patientDetials.disease}</p>
          </div>
        </div>
        <div className="bg-gray px-5 py-4 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-green font-semibold text-xl">
              Referral Dentist Details
            </p>
            <p className="text-[17px] items-center justify-end gap-2 flex">
              <Image src={CalenderInputIconV2} alt="Calender Icon" />
              {dentistDetails.date}
            </p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Name: {dentistDetails.name}</p>
            <p className="flex-1">GDC no.: {dentistDetails.gdcNo}</p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Phone: {dentistDetails.phone}</p>
            <p className="flex-1">Email: {dentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-[17px]">
            <p>Practice Address: {dentistDetails.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
