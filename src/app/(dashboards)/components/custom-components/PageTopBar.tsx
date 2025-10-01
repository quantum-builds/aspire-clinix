"use client";

import { ReactNode, Suspense } from "react";
import SearchBar from "./SearchBar";
import PageHeading from "./PageHeading";
import DateFilter from "../DateFilter";
import ExportButton from "../ExportButton";
import { TStatusOption } from "@/types/common";
import Image from "next/image";
import { BackButtonIcon } from "@/assets";
import { useRouter } from "next/navigation";

interface PageTopBarProps {
  pageHeading: string;
  showSearch: boolean;
  showFilters: boolean;
  showExport?: boolean;
  extraBtns?: ReactNode;
  showBackBtn?: boolean;
  statusOptions: TStatusOption[] | null;
}

export default function PageTopBar({
  pageHeading,
  showSearch,
  showFilters,
  showExport = false,
  extraBtns,
  statusOptions,
  showBackBtn = false,
}: PageTopBarProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBackBtn && (
          <div
            className="size-10 bg-dashboardBarBackground flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => router.back()}
          >
            <Image src={BackButtonIcon} alt="back" />
          </div>
        )}
        <PageHeading text={pageHeading} />
      </div>
      <Suspense>
        <div className="flex justify-end gap-3">
          {showSearch && <SearchBar placeholder="Enter Appointment Number" />}
          {showFilters && <DateFilter statusOptions={statusOptions} />}
          {showExport && <ExportButton />}
          {extraBtns}
        </div>
      </Suspense>
    </div>
  );
}
