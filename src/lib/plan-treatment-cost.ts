 
export const TREATMENT_PLAN_COST: Record<number, number> = {
  [1367845]: 2,
  [1526324]: 2,
};

export const HYPERBARIC_TREATMENT_ID = 1367623;
export const SAUNA_TREATMENT_ID = 1367624;
export const CONTRAST_SESSION_TREATMENT_ID = 1367845;




export function getTreatmentPlanCost(treatmentId: number): number {
  return TREATMENT_PLAN_COST[treatmentId] ?? 1;
}