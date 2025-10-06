import AssignedPatientDetails from "./components/AssignedPatientDetails";
import Button from "@/app/(dashboards)/components/Button";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { TReferralRequest } from "@/types/referral-request";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { calculateAge } from "@/utils/formatDateTime";

export default async function ReferralDetailsPage(props: { params: { id: string }; }) {
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

  const referralForm=referralRequestResponse.data.referralForm
  const patientDetails={
    name:referralForm.patientName,
    phone:referralForm.patientPhoneNumber,
    email:referralForm.patientEmail,
    disease:referralForm.referralDetails.join(","),
    age:String(calculateAge(referralForm.patientDateOfBirth))
  }

  const dentistDetails={
    name:referralForm.referralName,
    phone:referralForm.referralPhoneNumber,
    email:referralForm.referralEmail,
    gdcNo:referralForm.referralGDC,
    address:referralForm.patientAddress
  }

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals Details"
        showSearch={false}
        showBackBtn={true}
        showFilters={false}
        statusOptions={null}
        extraBtns={
          <Button
            text="Book an Appointment"
            href={`/clinic/referrals/${id}/unassigned/edit`}
          />
        }
      />
      <AssignedPatientDetails
        patientDetials={patientDetails}
        referralDentistDetails={dentistDetails}
      />
    </div>
  );
}
