"use client";

import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ReferralFormDetailModal from "@/app/(dashboards)/components/ReferralFormDetailModal";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { UploadPDFIcon } from "@/assets";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ReadOnlyCheckbox } from "@/components/ReadOnlyCheckBox";
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
  assignedDentistDetails: {
    name?: string;
    gdcNo?: string;
    email?: string;
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
  assignedDentistDetails,
  referralFormDetails,
}: PatientReferralDetailsProps) {
  const pathname = usePathname();
  const modalUrl = `${pathname}?showModal=true`;

  const hasAssignedDentistDetails =
    Boolean(assignedDentistDetails.name?.trim()) &&
    Boolean(assignedDentistDetails.gdcNo?.trim()) &&
    Boolean(assignedDentistDetails.email?.trim()) &&
    !assignedDentistDetails.name?.includes("undefined");

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <div className="w-full flex justify-between items-center">
        <p className="font-medium text-dashboardTextBlack text-2xl">
          Patient & Referral Dentist Details
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray p-6 space-y-5  rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl">Patient Details</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {patientDetials.name}</p>
            <p className="flex-1">Age: {patientDetials.age}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg ">
            <p>Address: {patientDetials.address}</p>
          </div>
        </div>
        {hasAssignedDentistDetails && (
          <div className="bg-gray p-6 space-y-5 rounded-2xl">
            <div className="flex justify-between items-center">
              <p className="text-green font-medium text-2xl">
                Assigned Dentist Details
              </p>
            </div>
            <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
              <p className="flex-1">Name: {assignedDentistDetails.name}</p>
              <p className="flex-1">GDC no.: {assignedDentistDetails.gdcNo}</p>
            </div>
            <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
              <p className="flex-1">Email: {assignedDentistDetails.email}</p>
            </div>
          </div>
        )}
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
          <div className="flex flex-col text-lg space-y-2">
            <div className="flex flex-row items-start">
              <p className="font-medium text-dashboardTextBlack w-40 shrink-0">
                Referral Details:
              </p>
              <p>{referralFormDetails.referralDeatils}</p>
            </div>
            <div className="flex flex-row items-start">
              <p className="font-medium text-dashboardTextBlack w-40 shrink-0">
                Description:
              </p>
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
    </div>
  );
}
