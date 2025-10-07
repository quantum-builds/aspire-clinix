
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { Suspense } from "react";

import AppointmentRequestPageWrapper from "./components/AssignDentistFormWrapper";
import AssignDentistFormSkeleton from "./components/skeleton/AssignedDentist";

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


  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referral Details"
        showSearch={false}
        showBackBtn={true}
        showFilters={false} statusOptions={null} />

      <Suspense key={id} fallback={<AssignDentistFormSkeleton/>}>
        <AppointmentRequestPageWrapper id={id} practiceId={practiceId} />
      </Suspense>
    </div>
  );
}
