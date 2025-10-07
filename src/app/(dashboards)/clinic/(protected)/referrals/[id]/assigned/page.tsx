
import { Suspense } from "react";

import AssignedWrapper from "./components/AssignedWrapper";
import AssignedWrapperSkeleton from "./components/skeletons/AssignedWrapper";


export default function ReferralDetailsPage(props: {
  params: { id: string };
}) {
  const { id } = props.params;
 
  return (
    <Suspense key={id} fallback={<AssignedWrapperSkeleton/>}>
      <AssignedWrapper id={id}/>
    </Suspense>
  );
}


