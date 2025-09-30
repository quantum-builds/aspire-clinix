export type TAdminCreate = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  fileUrl?: string;
};

export type TAdmin = Omit<TAdminCreate, "password"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  file?: string;
};
