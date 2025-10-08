
import { Suspense } from "react";

import AssignedWrapper from "./components/AssignedWrapper";
import AssignedWrapperSkeleton from "./components/skeletons/AssignedWrapper";


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
    <Suspense key={id} fallback={<AssignedWrapperSkeleton />}>
      <AssignedWrapper id={id} showModel={showModal} />
    </Suspense>
  );
}


