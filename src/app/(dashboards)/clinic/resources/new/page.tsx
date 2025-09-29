"use client";
import AddResourceForm from "../components/ResourceForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default function AddResourcePage() {
  return (
    <div className="w-full min-h-full flex flex-col gap-5">
      <PageTopBar
        showSearch={true}
        showFilters={false}
        pageHeading="Resources"
        statusOptions={[]}
      />
      <AddResourceForm />
    </div>
  );
}
