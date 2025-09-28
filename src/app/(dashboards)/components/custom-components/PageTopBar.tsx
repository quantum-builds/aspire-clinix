import { ReactNode } from "react";
import SearchBar from "./SearchBar";
import PageHeading from "./PageHeading";
import DateFilter from "../DateFilter";
import ExportButton from "../ExportButton";
import { TStatusOption } from "@/types/common";

interface PageTopBarProps {
  pageHeading: string;
  showSearch: boolean;
  showFilters: boolean;
  showExport?: boolean;
  extraBtns?: ReactNode;
  statusOptions: TStatusOption[] | null;
}

export default function PageTopBar({
  pageHeading,
  showSearch,
  showFilters,
  showExport = false,
  extraBtns,
  statusOptions,
}: PageTopBarProps) {
  return (
    <div className="flex items-center justify-between">
      <PageHeading text={pageHeading} />
      <div className="flex justify-end gap-3">
        {showSearch && <SearchBar placeholder="Enter Appointment Number" />}
        {showFilters && <DateFilter statusOptions={statusOptions} />}
        {showExport && <ExportButton />}
        {extraBtns}
      </div>
    </div>
  );
}
