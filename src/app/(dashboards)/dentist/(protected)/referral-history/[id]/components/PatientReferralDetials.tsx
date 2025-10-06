interface PatientReferralDetailsProps {
  patientDetials: {
    name: string;
    age: string;
    phone: string;
    email: string;
    disease: string;
  };
  assignedDentistDetails: {
    name?: string;
    gdcNo?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}

export default function PatientReferralDetails({
  patientDetials,
  assignedDentistDetails,
}: PatientReferralDetailsProps) {
  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <p className="font-medium text-dashboardTextBlack text-2xl">
        Patient & Dentist Details
      </p>
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
            <p>Disease: {patientDetials.disease}</p>
          </div>
        </div>
        {Object.values(assignedDentistDetails ?? {}).every(v => v) && (
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
    </div>
  );
}
