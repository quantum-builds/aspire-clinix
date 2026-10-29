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
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";
import { cn } from "@/lib/utils";

interface PageTopBarProps {
  pageHeading: string;
  showSearch: boolean;
  searchPlaceHolder?: string;
  showFilters: boolean;
  showExport?: boolean;
  extraBtns?: ReactNode;
  preBtns?: ReactNode;
  showBackBtn?: boolean;
  showDateFilter?: boolean;
  statusOptions: TStatusOption[] | null;
  callStatusOptions?: { value: string; label: string }[];
  lockAfterDate?: boolean;
  lockBeforeDate?: boolean;
  showDropdown?: boolean;
  filtersBelow?: boolean;
  showBreathworkNote?: boolean;
}

export default function PageTopBar({
  pageHeading,
  showSearch,
  searchPlaceHolder = "Enter Appointment Number",
  showFilters,
  showExport = false,
  extraBtns,
  preBtns,
  statusOptions,
  callStatusOptions,
  showDateFilter = true,
  showBackBtn = false,
  lockAfterDate = false,
  lockBeforeDate = false,
  showDropdown = false,
  filtersBelow = false,
  showBreathworkNote = false,
}: PageTopBarProps) {
  const router = useRouter();
  const [participantType, setParticipantType] = useState<string>("patient");
  return (
    <div className={cn("flex justify-between", filtersBelow ? "flex-col gap-3" : "items-center")}>
      <div className="flex w-full items-center justify-between ">
        <div className="flex items-center gap-3">
          {showBackBtn && (
            <div
              className="size-10 bg-dashboardBarBackground flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => router.back()}
            >
              <Image src={BackButtonIcon} alt="back" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <PageHeading text={pageHeading} />
            {showBreathworkNote && (
              <p className="text-sm italic text-[#1D120C]">
                *Note: If you want to view Breathwork appointments, please
                select Breathwork from the appointment filter.
              </p>
            )}
          </div>
        </div>
        <Suspense>
          <div className="flex justify-end gap-3">
            {preBtns}
            {showSearch && <SearchBar placeholder={searchPlaceHolder} />}
            {showFilters && !filtersBelow && (
              <DateFilter
                statusOptions={statusOptions}
                callStatusOptions={callStatusOptions}
                showDateFilter={showDateFilter}
                lockAfterDate={lockAfterDate}
                lockBeforeDate={lockBeforeDate}
                showAppointmentTypeFilter={true}
              />
            )}
            {showDropdown && (
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-base font-medium leading-6 text-gray-800">
                  Select whom to upload the report :
                </span>

                {/* black line directly under the dropdown text */}
                <div className="border-b border-black text-gray-700">
                  <Dropdown
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
                        const recipient =
                          val === "patient" ? "PATIENT" : "REFERRING_DENTIST";
                        url.searchParams.set("recipientType", recipient);
                        router.replace(url.pathname + url.search);
                      } catch (e) {
                        // ignore
                      }
                    }}
                    placeholder="Patient"
                    placeholderClassName="text-gray-600"
                    triggerClassName="px-2 py-0 text-base leading-6 min-w-[100px] min-h-0 flex items-center justify-between"
                    contentClassName="min-w-[160px] rounded-xl"
                    showClearOption= {false}
                  />
                </div>
              </div>
            )}
            {extraBtns}
          </div>
        </Suspense>
      </div>
      {showFilters && filtersBelow && (
        <div className="flex justify-end">
          <DateFilter
            statusOptions={statusOptions}
            callStatusOptions={callStatusOptions}
            showDateFilter={showDateFilter}
            lockAfterDate={lockAfterDate}
            lockBeforeDate={lockBeforeDate}
            showAppointmentTypeFilter={true}
          />
        </div>
      )}
    </div>
  );
}
