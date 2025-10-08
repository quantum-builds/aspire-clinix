"use client";

import { usePathname } from "next/navigation";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ReferralFormDetailModal from "@/app/(dashboards)/components/ReferralFormDetailModal";

interface PatientReferralDetailsProps {
  id: string;
  showModel: boolean;
  patientDetials: {
    name: string;
    age: string;
    phone: string;
    email: string;
    address: string;
  };
  dentistDetails: {
    name: string;
    gdcNo: string;
    phone: string;
    email: string;
    address: string;
  };
  referralFormDetails: {
    referralDeatils: string;
    treatmentDetails?: string;
    attendTreatment: string;
    medicalHistoryPDF?: string;
  };
}

export default function PatientReferralDetails({
  id,
  showModel,
  patientDetials,
  dentistDetails,
  referralFormDetails,
}: PatientReferralDetailsProps) {
  const pathname = usePathname();
  const modalUrl = `${pathname}?showModal=true`;

  return (
    <div className="bg-dashboardBarBackground w-full rounded-2xl px-6 py-6 space-y-3">
      <div className="w-full flex justify-between items-center">
        <p className="font-medium text-dashboardTextBlack text-2xl">
          Patient & Referral Dentist Details
        </p>
        <CustomButton
          text="See Referral Form Details"
          style="secondary"
          href={modalUrl}
        />
      </div>

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
            <p className="flex-1">Age: {patientDetials.age}</p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-[17px]">
            <p>Address: {patientDetials.address}</p>
          </div>
        </div>

        <div className="bg-gray px-5 py-4 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-green font-semibold text-xl">
              Referral Dentist Details
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

      {showModel && <ReferralFormDetailModal referralFormDetails={referralFormDetails} />}
    </div>
  );
}
