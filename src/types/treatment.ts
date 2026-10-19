export type TAvailability = {
  date: string;
  startTime: string;
  finishTime: string;
  duration: number;
  totalLimit: number;
  remainingLimit: number;
};

export type TTreatment = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  availabilities: TAvailability[] | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TTreatmentCreate = {
  name: string;
  description?: string | null;
  price: number;
  availabilities?: (Omit<TAvailability, "remainingLimit"> & {
    remainingLimit?: number;
  })[];
  isActive?: boolean;
};

export type TTreatmentUpdate = Partial<TTreatmentCreate>;
