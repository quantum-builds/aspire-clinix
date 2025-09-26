import { ReactNode } from "react";
import SearchBar from "./SearchBar";
import PageHeading from "./PageHeading";
import DateFilter from "../DateFilter";
import ExportButton from "../ExportButton";

interface PageTopBarProps {
  pageHeading: string;
  showSearch: boolean;
  showFilters: boolean;
  showExport?: boolean;
  extraBtns?: ReactNode;
}

export default function PageTopBar({
  pageHeading,
  showSearch,
  showFilters,
  showExport = false,
  extraBtns,
}: PageTopBarProps) {
  return (
    <div className="flex items-center justify-between">
      <PageHeading text={pageHeading} />
      <div className="flex justify-end gap-3">
        {showSearch && <SearchBar placeholder="Enter Appointment Number" />}
        {showFilters && <DateFilter />}
        {showExport && <ExportButton />}
        {extraBtns}
      </div>
    </div>
  );
}
