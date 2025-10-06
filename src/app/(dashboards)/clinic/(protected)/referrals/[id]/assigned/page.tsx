import AssignedPatientDetails from "./components/AssignedPatientDetails";
import AssignedAppointmentCard from "./components/AppointmentCard";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { Suspense } from "react";
import { calculateAge } from "@/utils/formatDateTime";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import { Response } from "@/types/common";


export default async function ReferralDetailsPage(props: {
  params: { id: string };
}) {
  const { id } = props.params;
  const referralRequestResponse: Response<TReferralRequest> = await getReferralRequest(id)

  if (!referralRequestResponse || !referralRequestResponse.status || !referralRequestResponse.data || !referralRequestResponse.data.referralForm) {
    return (
      <div className="min-h-screen flex flex-col gap-5">
        <PageTopBar
          pageHeading="Referrals Details"
          showSearch={false}
          showBackBtn={true}
          showFilters={false}
          statusOptions={null}
        />
        <NoContent1 />
      </div>
    )
  }
  console.log("referral request is  ",referralRequestResponse)
  if (!referralRequestResponse.data.assignedDentist || !referralRequestResponse.data.appointment) {
    return (
      <div className="min-h-screen flex flex-col gap-5">
        <PageTopBar
          pageHeading="Referrals Details"
          showSearch={false}
          showBackBtn={true}
          showFilters={false}
          statusOptions={null}
        />
        <NoContent1 text="Referral is not assigned yet!!!" />
      </div>)
  }

  const referralForm = referralRequestResponse.data.referralForm
  const assignedDentist = referralRequestResponse.data.assignedDentist
  const appointment=referralRequestResponse.data.appointment

  const patientDetails = {
    name: referralForm.patientName,
    phone: referralForm.patientPhoneNumber,
    email: referralForm.patientEmail,
    disease: referralForm.referralDetails.join(","),
    age: String(calculateAge(referralForm.patientDateOfBirth))
  }

  const dentistDetails = {
    name: referralForm.referralName,
    phone: referralForm.referralPhoneNumber,
    email: referralForm.referralEmail,
    gdcNo: referralForm.referralGDC,
    address: referralForm.patientAddress
  }

  const assignedDentistDetails = {
    name: assignedDentist?.fullName,
    phone: assignedDentist?.phoneNumber,
    email: assignedDentist?.email,
    gdcNo: assignedDentist?.gdcNo,
    address: assignedDentist?.practiceAddress
  }


  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals Details"
        showSearch={false}
        showFilters={false}
        showBackBtn={true}
        statusOptions={[]}
      />

      <AssignedPatientDetails
        patientDetials={patientDetails}
        assignedDentistDetails={dentistDetails}
        referralDentistDetails={assignedDentistDetails}
      />

      <AssignedAppointmentCard appointment={appointment} />
    </div>
  );
}


