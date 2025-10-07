import { Suspense } from "react";
import UnAssignedWrapper from "./components/UnAssignedWrapper";
import UnAssignedPatientDetailsSkeleton from "./components/skeletons/UnAssignedWrapper";

export default async function ReferralDetailsPage(props: { params: { id: string }; }) {
  const { id } = props.params;
 
  return (
    <Suspense key={id} fallback={<UnAssignedPatientDetailsSkeleton/>}>
      <UnAssignedWrapper id={id}/>
    </Suspense>
  );
}
