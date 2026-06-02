"use client";

import { useState } from "react";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import BindAppointmentModal from "./BindAppointmentModal";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { ReadOnlyCheckbox } from "@/components/ReadOnlyCheckBox";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadPDFIcon } from "@/assets";

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
  const router = useRouter();

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
        <div className="bg-gray p-6 1xl50:space-y-5 space-y-0 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl max-1xl50:mb-3">
              Referral Form Details
            </p>
            {referralFormDetails.medicalHistoryPDF && (
              <PdfModal
                pdfUrl={referralFormDetails.medicalHistoryPDF}
                trigger={
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Image src={UploadPDFIcon} alt="PDF Icon" />
                    <p className="underline text-green">See Document</p>
                  </div>
                }
              />
            )}
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-start">
            <div className="flex-1 space-y-1">
              <p className="font-medium text-dashboardTextBlack">
                Referral Details
              </p>
              <p>{referralFormDetails.referralDeatils}</p>
            </div>
            <div className="flex-1 space-y-1 max-1xl50:mt-3">
              <p className="font-medium text-dashboardTextBlack">Description</p>
              <p>
                {referralFormDetails.treatmentDetails ? (
                  referralFormDetails.treatmentDetails
                ) : (
                  <span className="italic">NO Description Added</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center text-lg max-1xl50:pt-3">
            <div className="space-y-1">
              <p className="font-medium text-dashboardTextBlack">
                Would referral dentist like to attend the treatment appointment
                with the patient and shadow the dentist?
              </p>
              {referralFormDetails.attendTreatment === "yes" ? (
                <ReadOnlyCheckbox label="Yes" checked={true} />
              ) : (
                <ReadOnlyCheckbox label="No" checked={true} />
              )}
            </div>
          </div>
        </div>
      </div>

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
