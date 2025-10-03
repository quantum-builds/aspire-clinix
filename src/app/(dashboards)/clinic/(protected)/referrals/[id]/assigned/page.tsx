import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import AssignedPatientDetails from "./components/AssignedPatientDetails";
import AssignedAppointmentCard from "./components/AppointmentCard";
import { AppointmentDetails } from "@/types/common";
import Button from "@/app/(dashboards)/components/Button";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { Suspense } from "react";
import AssignedRequestWrapper from "./components/AssignedRequestWrapper";

export default async function ReferralDetailsPage(props: {
  params: { id: string };
}) {
  const { id } = props.params;

  // console.log(referralId);

  // const patientDetails = {
  //   name: "Harry Kane",
  //   gender: "Male",
  //   phone: "+971 1121 2234",
  //   email: "harrykane@gmail.com",
  //   disease: "Tooth Decay",
  //   referenceId: "121 110",
  // };

  // const dentistDetails = {
  //   date: "July 07,2025",
  //   name: "Harry Kane",
  //   gdcNo: "192 168 344",
  //   phone: "+971 1121 2234",
  //   email: "harrykane@gmail.com",
  //   address: "Clinic 400, Street 302, Oslo, Norway",
  // };

  // const PAST_APPOINTMENTS: AppointmentDetails = {
  //   date: "July 07, 2025",
  //   time: "12:30 PM",
  //   status: "Pending",
  //   appointmentNumber: "1621-115009",
  // };

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals Details"
        showSearch={false}
        showFilters={false}
        showBackBtn={true}
        statusOptions={[]}
      />

      <Suspense key={id} fallback={<div>Loading...</div>}>
        <AssignedRequestWrapper id={id} />
      </Suspense>
      {/* <AssignedPatientDetails
        patientDetials={patientDetails}
        assignedDentistDetails={dentistDetails}
        referralDentistDetails={dentistDetails}
      />

      <AssignedAppointmentCard appointment={PAST_APPOINTMENTS} /> */}
    </div>
  );
}
