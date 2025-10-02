import PatientReferralDetails from "./components/PatientReferralDetials";
import AppointmentGrid from "./components/AppointmentGrid";
import { AppointmentDetails } from "@/types/common";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ReferralDetailsPage({ params }: PageProps) {
  const referralId = params.id;
  console.log(referralId);

  const patientDetails = {
    name: "Harry Kane",
    gender: "Male",
    phone: "+971 1121 2234",
    email: "harrykane@gmail.com",
    disease: "Tooth Decay",
  };

  const dentistDetails = {
    date: "July 07,2025",
    name: "Harry Kane",
    gdcNo: "192 168 344",
    phone: "+971 1121 2234",
    email: "harrykane@gmail.com",
    address: "Clinic 400, Street 302, Oslo, Norway",
  };

  const APPOINTMENTS: AppointmentDetails[] = [
    {
      date: "July 07, 2025",
      time: "12:30 PM",
      status: "Pending",
      appointmentNumber: "1621-115009",
    },
  ];

  return (
    <div className="w-full min-h-[98.4vh] flex flex-col gap-5">
      <PageTopBar
        showFilters={true}
        showSearch={true}
        statusOptions={[]}
        pageHeading="Referral Requests"
      />
      <PatientReferralDetails
        patientDetials={patientDetails}
        dentistDetails={dentistDetails}
      />
      {APPOINTMENTS.length > 0 && (
        <AppointmentGrid appointments={APPOINTMENTS} />
      )}
    </div>
  );
}
