export interface CreatePlan {
  name: string;
  description: string;
  price: number;
  validity: number;
  includedTreatments: string[];
  discountId?: string;
  status: PlanStatus;
}
enum PlanStatus {
  ACTIVE,
  EXPIRED,
  UPCOMING,
}

export interface UpdatePlan {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  validity?: number;
  includedTreatments?: string[];
  discountId?: string;
  status?: PlanStatus;
}
