import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";

interface MembershipPlan {
  name: string;
  treatmentLimit: number | null;
  hyperbaricLimit: number | null;
  breathworkLimit: number | null;
  guestPassLimit: number | null;
}

interface MembershipResponse {
  id: string;
  planId: string;
  status: string;
  currentPeriodEnd: string;
  pendingPlanId: string | null;
  cancelAtPeriodEnd: boolean;
  currentPlanName: string | null;
  pendingPlanName: string | null;
  usedTreatments: number;
  usedHyperbaric: number;
  usedBreathwork: number;
  usedGuestPasses: number;
  plan: MembershipPlan | null;
}

export async function getCurrentMembership(): Promise<Response<MembershipResponse> | null> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.membership.current);

    if (response.data.status && response.data.data) {
      const data = response.data.data;
      return {
        ...response.data,
        data: {
          ...data,
          currentPlanName: data.plan?.name || null,
          pendingPlanName: data.pendingPlan?.name || null,
        },
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching membership:", error);
    return null;
  }
}
