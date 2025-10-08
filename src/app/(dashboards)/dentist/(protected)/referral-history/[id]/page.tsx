import { Suspense } from "react";
import ReferralHistoryDetail from "./components/ReferralHistoryDetailWrapper";
import ReferralHistoryDetailSkeleton from "./components/skeleton/ReferralHistoryDetail";

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
      <ReferralHistoryDetail id={id} showModel={showModal}/>
    </Suspense>
  );
}
