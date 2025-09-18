import { ResoucrceType } from "@prisma/client";
import { TPaginationNumbers } from "./common";

export interface TResource {
  id: string;
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TResourcePagination {
  pdf: TPaginationNumbers;
  video: TPaginationNumbers;
  page: number;
}

export interface TResourceResponse {
  resources: { pdfs?: TResource[]; videos?: TResource[] };
  pagination: TResourcePagination;
}
