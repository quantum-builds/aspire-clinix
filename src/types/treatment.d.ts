export interface CreateTreatment {
  name: string;
  description: string;
  cost: number;
}

export interface UpdateTreatment {
  id: string;
  name?: string;
  description?: string;
  cost?: number;
}
