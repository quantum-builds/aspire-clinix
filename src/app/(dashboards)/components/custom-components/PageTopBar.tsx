"use client";

import { ReactNode, Suspense, useEffect, useRef, useState } from "react";
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
import { Check, ChevronDown, Users } from "lucide-react";

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
  restrictAfterToToday?: boolean;
  restrictBeforeFromToday?: boolean;
  showDropdown?: boolean;
  filtersBelow?: boolean;
  showBreathworkNote?: boolean;
  note?: ReactNode;
}

export default function PageTopBar({
  pageHeading,
  showSearch,
  searchPlaceHolder = "Search by patient or referral dentist",
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
  restrictAfterToToday = false,
  restrictBeforeFromToday = false,
  showDropdown = false,
  filtersBelow = false,
  showBreathworkNote = false,
  note,
}: PageTopBarProps) {
  const router = useRouter();
  const [participantType, setParticipantType] = useState<string>("both");
  const [recipientOpen, setRecipientOpen] = useState(false);
  const recipientRef = useRef<HTMLDivElement>(null);

  const recipientOptions = [
    {
      value: "dentist",
      label: "Referring Dentist",
      description: "Only the dentist gets the report",
    },
    {
      value: "both",
      label: "Patient & Referring Dentist",
      description: "Both get a copy",
    },
  ];
  const selectedRecipient = recipientOptions.find(
    (o) => o.value === participantType
  );

  // close the recipient menu on outside click / Escape
  useEffect(() => {
    if (!recipientOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!recipientRef.current?.contains(e.target as Node)) {
        setRecipientOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRecipientOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [recipientOpen]);

  const showBottomFilters = showFilters && filtersBelow;
  const showBottomRow = showBreathworkNote || showBottomFilters || !!note;

  return (
    <div
      className={cn(
        "flex justify-between",
        showBottomRow ? "flex-col gap-3" : "items-center"
      )}
    >
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
          <PageHeading text={pageHeading} />
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
                restrictAfterToToday={restrictAfterToToday}
                restrictBeforeFromToday={restrictBeforeFromToday}
                showAppointmentTypeFilter={showBreathworkNote}
              />
            )}
            {showDropdown && (
              <div ref={recipientRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={recipientOpen}
                  onClick={() => setRecipientOpen((o) => !o)}
                  className={cn(
                    "flex min-w-[290px] items-center gap-3 rounded-full border bg-white py-1.5 pl-1.5 pr-4 text-left shadow-sm transition-colors",
                    recipientOpen
                      ? "border-green"
                      : "border-[#D9CFC1] hover:border-green"
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-dashboardBarBackground text-green">
                    <Users className="size-[18px]" strokeWidth={1.75} />
                  </span>
                  <span className="flex flex-1 flex-col leading-tight">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Send report to
                    </span>
                    <span className="text-[15px] font-semibold text-gray-900">
                      {selectedRecipient?.label ?? "Patient & Referring Dentist"}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-[18px] text-green transition-transform duration-200",
                      recipientOpen && "rotate-180"
                    )}
                    strokeWidth={2}
                  />
                </button>

                {recipientOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 top-full z-50 mt-2 flex w-[300px] flex-col gap-0.5 rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_rgba(29,18,12,0.12)]"
                  >
                    {recipientOptions.map((option) => {
                      const active = option.value === participantType;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setRecipientOpen(false);
                            if (active) return;
                            const val = option.value as "dentist" | "both";
                            setParticipantType(val);
                            try {
                              const url = new URL(window.location.href);
                              const recipient =
                                val === "both" ? "BOTH" : "REFERRING_DENTIST";
                              url.searchParams.set("recipientType", recipient);
                              router.replace(url.pathname + url.search);
                            } catch (e) {
                              // ignore
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            active ? "bg-[#F5F1EB]" : "hover:bg-[#F5F1EB]/60"
                          )}
                        >
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-gray-900">
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-[13px] text-gray-500">
                              {option.description}
                            </span>
                          </span>
                          {active && (
                            <Check
                              className="size-[18px] text-green"
                              strokeWidth={2.5}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {extraBtns}
          </div>
        </Suspense>
      </div>

      {/* Bottom row: note on the left (sits right above the white card), filters on the right */}
      {showBottomRow && (
        <div className="flex items-end justify-between gap-3">
          {showBreathworkNote ? (
            <p className="text-sm italic text-[#1D120C]">
              *Note: If you want to view Breathwork appointments, please select
              Breathwork from the appointment filter.
            </p>
          ) : note ? (
            <p className="text-sm italic text-[#1D120C]">*Note: {note}</p>
          ) : (
            <span />
          )}
          {showBottomFilters && (
            <Suspense>
              <DateFilter
                statusOptions={statusOptions}
                callStatusOptions={callStatusOptions}
                showDateFilter={showDateFilter}
                lockAfterDate={lockAfterDate}
                lockBeforeDate={lockBeforeDate}
                restrictAfterToToday={restrictAfterToToday}
                restrictBeforeFromToday={restrictBeforeFromToday}
                showAppointmentTypeFilter={showBreathworkNote}
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}