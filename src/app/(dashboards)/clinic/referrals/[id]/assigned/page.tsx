import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import AssignedPatientDetails from "./components/AssignedPatientDetails";
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
    referenceId: "121 110",
  };

  const dentistDetails = {
    date: "July 07,2025",
    name: "Harry Kane",
    gdcNo: "192 168 344",
    phone: "+971 1121 2234",
    email: "harrykane@gmail.com",
    address: "Clinic 400, Street 302, Oslo, Norway",
  };

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Referral Details</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
          <DateFilter />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          text="Assign Patient"
          href={`/clinic/referrals/${referralId}/assigned/edit`}
        />
      </div>
      <AssignedPatientDetails
        patientDetials={patientDetails}
        referralDentistDetails={dentistDetails}
      />
    </div>
  );
}
