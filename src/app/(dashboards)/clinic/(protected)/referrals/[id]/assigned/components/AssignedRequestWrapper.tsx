import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { Response } from "@/types/common";
import { TReferralRequest } from "@/types/referral-request";

interface AssignedRequestWrapperProps {
  id: string;
}
export default async function AssignedRequestWrapper({
  id,
}: AssignedRequestWrapperProps) {
  const response: Response<TReferralRequest> = await getReferralRequest(id);

  return <div></div>;
}
