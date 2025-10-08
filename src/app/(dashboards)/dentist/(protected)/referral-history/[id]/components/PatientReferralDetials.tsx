"use client"

import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ReferralFormDetailModal from "@/app/(dashboards)/components/ReferralFormDetailModal";
import { usePathname } from "next/navigation";

interface PatientReferralDetailsProps {
  id: string
  showModel: boolean
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
    phone?: string;
    email?: string;
    address?: string;
  };
  referralFormDetails: {
    referralDeatils: string
    treatmentDetails?: string,
    attendTreatment: string,
    medicalHistoryPDF?: string
  }
}

export default function PatientReferralDetails({
  id,
  showModel,
  patientDetials,
  assignedDentistDetails,
  referralFormDetails
}: PatientReferralDetailsProps) {

  const pathname = usePathname();
  const modalUrl = `${pathname}?showModal=true`;

  console.log("Assigned dentist ", assignedDentistDetails)
  console.log("length is ",Object.keys(assignedDentistDetails).length)

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
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
        {Object.keys(assignedDentistDetails).length !== 0 && Object.values(assignedDentistDetails ?? {}).every(v => v) && (
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
              <p className="flex-1">Phone: {assignedDentistDetails.phone}</p>
              <p className="flex-1">Email: {assignedDentistDetails.email}</p>
            </div>
            <div className="flex justify-between items-center text-lg">
              <p>Practice Address: {assignedDentistDetails.address}</p>
            </div>
          </div>
        )}
      </div>
      {showModel && (
        <ReferralFormDetailModal
          referralFormDetails={referralFormDetails}
        />
      )}
    </div>
  );
}
