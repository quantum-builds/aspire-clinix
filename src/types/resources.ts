import { ResoucrceType } from "@prisma/client";
import { TPaginationNumbers } from "./common";

export type TResourceCreate = {
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
}

export type TResource =TResourceCreate & {
  id: string;
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
