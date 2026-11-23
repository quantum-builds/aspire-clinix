"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CalenderIcon } from "@/assets";
import CustomPopover from "@/app/(dashboards)/components/custom-components/Popover";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";

const YEARS_TO_SHOW = 5;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Selected month from the URL ("YYYY-MM"), defaults to the current month.
  const monthParam = searchParams.get("month") || "";
  const isValidParam = /^\d{4}-\d{2}$/.test(monthParam);
  const [selectedYear, selectedMonth] = isValidParam
    ? monthParam.split("-").map(Number)
    : [currentYear, currentMonth];

  const YEAR_OPTIONS = Array.from({ length: YEARS_TO_SHOW }).map((_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  // Future months of the current year can't be selected.
  const MONTH_OPTIONS = MONTH_NAMES.map((name, i) => ({
    value: String(i + 1),
    label: name,
    disabled: selectedYear === currentYear && i + 1 > currentMonth,
  }));

  const updateMonth = (year: number, month: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Picking the current year keeps the month from going into the future.
    const safeMonth =
      year === currentYear && month > currentMonth ? currentMonth : month;

    params.set("month", `${year}-${String(safeMonth).padStart(2, "0")}`);
    router.push(`?${params.toString()}`);
  };

  const clearSelection = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("month");
    router.push(`?${params.toString()}`);
  };

  const activeFilterCount = isValidParam ? 1 : 0;

  return (
    <CustomPopover
      trigger={
        <div className="bg-dashboardBarBackground h-14 xl:w-36 w-14 xl:p-2 xl:pl-4 flex xl:justify-between justify-center items-center gap-4 rounded-full cursor-pointer">
          <p className="text-[17px] hidden xl:block">Filters</p>
          <div className="relative xl:w-10 xl:h-10 w-11 h-11 rounded-full xl:bg-gray flex justify-center items-center">
            <Image src={CalenderIcon} alt="Calendar Icon" className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
        </div>
      }
      className="w-[392px]"
    >
      <div className="p-6 rounded-2xl border border-green bg-white">
        <div className="flex flex-col gap-5">
          <p className="font-medium text-xl">Filter Analytics</p>

          <div className="space-y-4">
            <div className="flex gap-6">
              {/* Month */}
              <div className="w-full space-y-[2px]">
                <p className="text-green font-medium">Month</p>
                <Dropdown
                  options={MONTH_OPTIONS}
                  value={String(selectedMonth)}
                  onValueChange={(newValue) => {
                    if (!newValue) return;
                    updateMonth(selectedYear, Number(newValue));
                  }}
                  placeholder="Select Month"
                  className="w-full"
                  triggerClassName="w-full border border-green p-3 h-10 rounded-lg flex justify-between items-center cursor-pointer"
                  contentClassName="w-full border border-green rounded-lg bg-white mt-2"
                  showClearOption={false}
                />
              </div>

              {/* Year */}
              <div className="w-full space-y-[2px]">
                <p className="text-green font-medium">Year</p>
                <Dropdown
                  options={YEAR_OPTIONS}
                  value={String(selectedYear)}
                  onValueChange={(newValue) => {
                    if (!newValue) return;
                    updateMonth(Number(newValue), selectedMonth);
                  }}
                  placeholder="Select Year"
                  className="w-full"
                  triggerClassName="w-full border border-green p-3 h-10 rounded-lg flex justify-between items-center cursor-pointer"
                  contentClassName="w-full border border-green rounded-lg bg-white mt-2"
                  showClearOption={false}
                />
              </div>
            </div>

            {isValidParam && (
              <button
                onClick={clearSelection}
                className="text-sm text-green mt-1 underline hover:opacity-80"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      </div>
    </CustomPopover>
  );
}
