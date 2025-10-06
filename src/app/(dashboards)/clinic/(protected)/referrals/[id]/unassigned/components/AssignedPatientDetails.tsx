interface PatientReferralDetailsProps {
  patientDetials: {
    referenceId?: string;
    name: string;
    age: string;
    phone: string;
    email: string;
    disease: string;
  };

  referralDentistDetails: {
    name: string;
    gdcNo: string;
    phone: string;
    email: string;
    address: string;
  };
}

export default function AssignedPatientDetails({
  patientDetials,
  referralDentistDetails,
}: PatientReferralDetailsProps) {
  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <p className="font-medium text-dashboardTextBlack text-2xl">
        Patient & Referral Dentist Details
      </p>

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
            <p>Disease: {patientDetials.disease}</p>
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
    </div>
  );
}
