import { ResoucrceType } from "@prisma/client";
import { TPaginationNumbers } from "./common";

export type TResource = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TResourcePagination = {
  pdf: TPaginationNumbers;
  video: TPaginationNumbers;
  page: number;
};

export type TResourceResponse = {
  resources: { pdfs?: TResource[]; videos?: TResource[] };
  pagination: TResourcePagination;
};
