import BackButton from "@/app/(dashboards)/components/BackButton";
import { getPractices } from "@/services/practice/practiceQuery";
import { Response } from "@/types/common";
import { TPracticeResponse } from "@/types/practice"; import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { Suspense } from "react";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import AppointmentRequestPageWrapper from "./components/AssignDentistFormWrapper";

type PageProps = {

};

export default async function ReferralDetailsPage(props: {
  params: {
    id: string;
  };
  searchParams?: Promise<{
    practiceId?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || ""
  const practiceResponse: Response<TPracticeResponse> = await getPractices({})
  const practices = practiceResponse.data?.practices ?? [];
  const referralRequestResponse: Response<TReferralRequest> =
    await getReferralRequest(id);
  const referralRequest = referralRequestResponse?.data

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referral Details"
        showSearch={false}
        showBackBtn={true}
        showFilters={false} statusOptions={null} />

      <Suspense key={id} fallback={<div>Loading...</div>}>
        <AppointmentRequestPageWrapper id={id} practiceId={practiceId} practices={practices} referralRequest={referralRequest} />
      </Suspense>
    </div>
  );
}
