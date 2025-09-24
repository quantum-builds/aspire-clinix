interface PatientReferralDetailsProps {
  patientDetials: {
    referenceId?: string;
    name: string;
    gender: string;
    phone: string;
    email: string;
    disease: string;
  };
  assignedDentistDetails: {
    date: string;
    name: string;
    gdcNo: string;
    phone: string;
    email: string;
    address: string;
  };
  referralDentistDetails: {
    date: string;
    name: string;
    gdcNo: string;
    phone: string;
    email: string;
    address: string;
  };
}

export default function AssignedPatientDetails({
  patientDetials,
  assignedDentistDetails,
  referralDentistDetails,
}: PatientReferralDetailsProps) {
  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <p className="font-medium text-dashboardTextBlack text-2xl">
        Patient, Dentist & Referral Dentist Details
      </p>

      <div className="bg-gray p-6 space-y-5 rounded-2xl">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium text-green">Patient</p>
          <p className="text-xl italic text-green">
            Reference Number: REF {patientDetials.referenceId}
          </p>
        </div>
        <div className="grid grid-cols-4 text-lg">
          <p>Name: {patientDetials.name}</p>
          <p>Gender: {patientDetials.gender}</p>
          <p>Disease: {patientDetials.disease}</p>
        </div>
        <div className="grid grid-cols-4 text-lg">
          <p>Phone: {patientDetials.phone}</p>
          <p>Email: {patientDetials.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray p-6 space-y-5 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl">Assigned Dentist</p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Name: {assignedDentistDetails.name}</p>
            <p className="flex-1">GDC no.: {assignedDentistDetails.gdcNo}</p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Phone: {assignedDentistDetails.phone}</p>
            <p className="flex-1">Email: {assignedDentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>Practice Address: {assignedDentistDetails.address}</p>
          </div>
        </div>
        <div className="bg-gray p-6 space-y-5 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl">Referral Dentist</p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Name: {referralDentistDetails.name}</p>
            <p className="flex-1">GDC no.: {referralDentistDetails.gdcNo}</p>
          </div>
          <div className="flex items-center text-lg">
            <p className="flex-1">Phone: {referralDentistDetails.phone}</p>
            <p className="flex-1">Email: {referralDentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>Practice Address: {referralDentistDetails.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
