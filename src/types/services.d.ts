export type TService = {
  id: string;
  name: string;
  description?: string;
  subServices: TSubService[];
};
