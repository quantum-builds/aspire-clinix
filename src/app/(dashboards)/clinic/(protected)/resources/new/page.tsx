"use client";
import { ResoucrceType } from "@prisma/client";
import AddResourceForm from "../components/ResourceForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function AddResourcePage(props: {
  searchParams?: {
    type?: string
  };
}
) {
  const type = props.searchParams?.type as ResoucrceType | undefined
  return (
    <div className="w-full min-h-[103vh] flex flex-col gap-5">
      <PageTopBar
        showSearch={false}
        showFilters={false}
        showBackBtn={true}
        pageHeading="Resources"
        statusOptions={[]}
      />
      <AddResourceForm type={type} />
    </div>
  );
}
