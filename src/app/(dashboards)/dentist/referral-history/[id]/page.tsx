import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import PatientReferralDetails from "./components/PatientReferralDetials";
import AppointmentGrid from "./components/AppointmentGrid";
import { AppointmentDetails } from "@/types/common";
import Button from "@/app/(dashboards)/components/Button";

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

  const PAST_APPOINTMENTS: AppointmentDetails[] = [
    {
      date: "July 07, 2025",
      time: "12:30 PM",
      status: "Did not attend",
      appointmentNumber: "1621-115009",
    },
    {
      date: "July 07, 2025",
      time: "12:30 PM",
      status: "Completed",
      appointmentNumber: "1621-115009",
    },
  ];

  const UPCOMING_APPOINTMENTS: AppointmentDetails[] = [
    {
      date: "July 07, 2025",
      time: "12:30 PM",
      status: "Pending",
      appointmentNumber: "1621-115009",
    },
    {
      date: "July 07, 2025",
      time: "12:30 PM",
      status: "Pending",
      appointmentNumber: "1621-115009",
    },
  ];

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Referral Detail</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
          <DateFilter statusOptions={null} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          text="View Referral form"
          href={`/dentist/referral-history/${referralId}/edit`}
        />
      </div>
      <PatientReferralDetails
        patientDetials={patientDetails}
        dentistDetails={dentistDetails}
      />
      {UPCOMING_APPOINTMENTS.length > 0 && (
        <AppointmentGrid
          appointments={UPCOMING_APPOINTMENTS}
          appointmentType="upcoming"
        />
      )}

      {PAST_APPOINTMENTS.length > 0 && (
        <AppointmentGrid
          appointments={PAST_APPOINTMENTS}
          appointmentType="past"
        />
      )}
    </div>
  );
}
