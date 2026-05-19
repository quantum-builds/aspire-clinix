"use client";

import { useState } from "react";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ReferralFormDetailModal from "@/app/(dashboards)/components/ReferralFormDetailModal";
import BindAppointmentModal from "./BindAppointmentModal";
import { usePathname, useRouter } from "next/navigation";
import { log } from "console";

interface PatientReferralDetailsProps {
  id: string;
  showModel: boolean;
  patientDetials: {
    referenceId?: string;
    name: string;
    age: string;
    phone: string;
    email: string;
    address: string;
  };

  referralDentistDetails: {
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

  referralRequestId: string;
}

export default function UnAssignedPatientDetails({
  id,
  showModel,
  referralFormDetails,
  patientDetials,
  referralDentistDetails,
  referralRequestId,
}: PatientReferralDetailsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const modalUrl = `${pathname}?showModal=true`;

  const [isBindModalOpen, setIsBindModalOpen] = useState(false);

  const handleAppointmentBound = () => {
    // Refresh the page to show updated data
    router.refresh();
  };

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <div className="w-full flex justify-between items-center">
        <p className="font-medium text-dashboardTextBlack text-2xl">
          Patient & Referral Dentist Details
        </p>
        <div className="flex gap-3">
          <CustomButton
            text="Bind with Appointment"
            style="primary"
            handleOnClick={() => setIsBindModalOpen(true)}
          />
          <CustomButton
            text="See Referral Form Details"
            style="secondary"
            href={modalUrl}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray p-6 1xl50:space-y-5 space-y-0 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl max-1xl50:mb-3">
              Patient
            </p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {patientDetials.name}</p>
            <p className="flex-1">Age: {patientDetials.age}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg max-1xl50:pt-3">
            <p>Address: {patientDetials.address}</p>
          </div>
        </div>
        <div className="bg-gray p-6 1xl50:space-y-5 space-y-0 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl max-1xl50:mb-3">
              Referral Dentist
            </p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {referralDentistDetails.name}</p>
            <p className="flex-1">GDC no.: {referralDentistDetails.gdcNo}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Phone: {referralDentistDetails.phone}</p>
            <p className="flex-1">Email: {referralDentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg max-1xl50:pt-3">
            <p>Practice Address: {referralDentistDetails.address}</p>
          </div>
        </div>
      </div>
      {showModel && (
        <ReferralFormDetailModal referralFormDetails={referralFormDetails} />
      )}

      <BindAppointmentModal
        isOpen={isBindModalOpen}
        onClose={() => setIsBindModalOpen(false)}
        patientName={patientDetials.name}
        referralRequestId={referralRequestId}
        onAppointmentBound={handleAppointmentBound}
      />
    </div>
  );
}
