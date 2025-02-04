interface EditDentist {
  active?: boolean;
  colour?: string;
  gdcNumber?: string;
  nhsNumber?: string;
}

interface ListDentist {
  siteId?: string;
  siteId?: string[];
  createdAfter?: Date;
  updatedAfter?: Date;
}
