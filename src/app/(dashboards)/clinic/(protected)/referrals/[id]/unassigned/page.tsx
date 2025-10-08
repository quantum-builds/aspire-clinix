import { Suspense } from "react";
import UnAssignedWrapper from "./components/UnAssignedWrapper";
import UnAssignedPatientDetailsSkeleton from "./components/skeletons/UnAssignedWrapper";

export default async function ReferralDetailsPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    showModal?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const showModal = searchParams?.showModal === "true";

  return (
    <Suspense key={id} fallback={<UnAssignedPatientDetailsSkeleton />}>
      <UnAssignedWrapper id={id} showModel={showModal}/>
    </Suspense>
  );
}
