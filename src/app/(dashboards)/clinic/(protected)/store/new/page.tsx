"use client";

import AddProductForm from "./components/ProductForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default function AddResourcePage() {
  return (
    <div className="min-h-full flex flex-col gap-5 mb-10">
      <PageTopBar
        showSearch={true}
        showFilters={false}
        pageHeading="Aspire Store"
        statusOptions={[]}
      />
      <AddProductForm />
    </div>
  );
}
