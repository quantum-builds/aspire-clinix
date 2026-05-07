"use client";

import { ReactNode, Suspense, useState } from "react";
import SearchBar from "./SearchBar";
import PageHeading from "./PageHeading";
import DateFilter from "../DateFilter";
import ExportButton from "../ExportButton";
import { TStatusOption } from "@/types/common";
import Image from "next/image";
import { BackButtonIcon } from "@/assets";
import { useRouter } from "next/navigation";
import DropDown from "./DropDown";

interface PageTopBarProps {
  pageHeading: string;
  showSearch: boolean;
  searchPlaceHolder?: string;
  showFilters: boolean;
  showExport?: boolean;
  extraBtns?: ReactNode;
  showBackBtn?: boolean;
  showDateFilter?: boolean;
  statusOptions: TStatusOption[] | null;
  lockAfterDate?: boolean;
  lockBeforeDate?: boolean;
  showDropdown?: boolean;
}

export default function PageTopBar({
  pageHeading,
  showSearch,
  searchPlaceHolder = "Enter Appointment Number",
  showFilters,
  showExport = false,
  extraBtns,
  statusOptions,
  showDateFilter = true,
  showBackBtn = false,
  lockAfterDate = false,
  lockBeforeDate = false,
  showDropdown = false,
}: PageTopBarProps) {
  const router = useRouter();
  const [participantType, setParticipantType] = useState<"patient" | "dentist">(
    "patient",
  );
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
          {showSearch && <SearchBar placeholder={searchPlaceHolder} />}
          {showFilters && (
            <DateFilter
              statusOptions={statusOptions}
              showDateFilter={showDateFilter}
              lockAfterDate={lockAfterDate}
              lockBeforeDate={lockBeforeDate}
            />
          )}
          {showExport && <ExportButton />}
          {showDropdown && (
            <DropDown
              options={[
                { value: "patient", label: "Patient" },
                { value: "dentist", label: "Refering Dentist" },
              ]}
              value={participantType}
              onValueChange={(v) => {
                if (!v) return;
                const val = v as "patient" | "dentist";
                setParticipantType(val);
                try {
                  const url = new URL(window.location.href);
                  const recipient = val === "patient" ? "PATIENT" : "REFERRING_DENTIST";
                  url.searchParams.set("recipientType", recipient);
                  // replace so navigation state doesn't add history entries
                  router.replace(url.pathname + url.search);
                } catch (e) {
                  // ignore
                }
              }}

              placeholder="Patient"
              placeholderClassName="text-gray-600"
              triggerClassName="border border-green rounded-full px-4 py-2 bg-white text-sm min-w-[160px] flex items-center justify-between"
              contentClassName="min-w-[220px] rounded-xl"
              showClearOption={false}
            />
          )}
          {extraBtns}
        </div>
      </Suspense>
    </div>
  );
}
