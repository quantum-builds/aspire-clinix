"use client";
import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import AddResourceForm from "../components/ResourceForm";
import { Suspense } from "react";

export default function AddResourcePage() {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Resources</h1>
        <Suspense>
          <div className="flex items-center gap-3">
            <SearchBar placeholder="Enter Id or patient/dentist name" />
            <DateFilter />
          </div>
        </Suspense>
      </div>
      <AddResourceForm />
    </div>
  );
}
