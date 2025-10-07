import { Suspense } from "react";
import ReferralHistoryDetail from "./components/ReferralHistoryDetailWrapper";
import ReferralHistoryDetailSkeleton from "./components/skeleton/ReferralHistoryDetail";

export default async function ReferralDetailsPage(props: {
  params: { id: string };
}) {
  const { id } = props.params;

  return (
    <Suspense key={id} fallback={< ReferralHistoryDetailSkeleton/>}>
      <ReferralHistoryDetail id={id} />
    </Suspense>
  );
}
