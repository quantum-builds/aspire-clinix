import PatientReferralDetails from "./components/PatientReferralDetials";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { calculateAge } from "@/utils/formatDateTime";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import AppointmentCard from "./components/AppointmentCard";


export default async function ReferralDetailsPage(props: {
  params: { id: string };
}) {
  const { id } = props.params;
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

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

  const referralForm = referralRequestResponse.data.referralForm
  const appointment = referralRequestResponse.data.appointment

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

  return (
    <div className="w-full min-h-[98.4vh] flex flex-col gap-5">
      <PageTopBar
        showFilters={true}
        showSearch={true}
        showBackBtn={true}
        statusOptions={[]}
        pageHeading="Referral Requests"
      />
      <PatientReferralDetails
        patientDetials={patientDetails}
        dentistDetails={dentistDetails}
      />

      {
        appointment &&
        <AppointmentCard appointment={appointment} role={role??""} />
      }
    </div>
  );
}
