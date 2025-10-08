import { Suspense } from "react";
import ReferralRequestDetail from "./components/ReferralRequestDetailsWrapper";
import ReferralHistoryDetailSkeleton from "../../referral-history/[id]/components/skeleton/ReferralHistoryDetail";


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
    <Suspense key={id} fallback={< ReferralHistoryDetailSkeleton />}>
      <ReferralRequestDetail id={id} showModel={showModal} />
    </Suspense>
  );
}
