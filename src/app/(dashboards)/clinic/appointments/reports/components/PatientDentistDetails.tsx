interface PatientRDentistDetailsProps {
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

export default function PatientRDentistDetails({
  patientDetials,
  dentistDetails,
}: PatientRDentistDetailsProps) {
  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <p className="font-medium text-dashboardTextBlack text-2xl">
        Patient & Assigned Dentist Details
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray p-6 space-y-5  rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl ">Patient</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {patientDetials.name}</p>
            <p className="flex-1">Gender: {patientDetials.gender}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg ">
            <p>Disease: {patientDetials.disease}</p>
          </div>
        </div>
        <div className="bg-gray p-6 space-y-5  rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl ">Assigned Dentist</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {dentistDetails.name}</p>
            <p className="flex-1">GDC no.: {dentistDetails.gdcNo}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Phone: {dentistDetails.phone}</p>
            <p className="flex-1">Email: {dentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg ">
            <p>Practice Address: {dentistDetails.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
