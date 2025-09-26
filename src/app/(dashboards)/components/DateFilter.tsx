"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { CalenderInputIconV2, CalenderIcon, DropDownIcon } from "@/assets";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [onDate, setOnDate] = useState<Date | null>(null);
  const [afterDate, setAfterDate] = useState<Date | null>(null);
  const [beforeDate, setBeforeDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // Status options
  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

  useEffect(() => {
    const on = searchParams.get("on");
    const after = searchParams.get("after");
    const before = searchParams.get("before");
    const statusParam = searchParams.get("status");

    if (on) setOnDate(new Date(on));
    if (after) setAfterDate(new Date(after));
    if (before) setBeforeDate(new Date(before));
    if (statusParam) setStatus(statusParam);
  }, [searchParams]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStatusLabel = (value: string | null) => {
    if (!value) return "";
    const option = statusOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === "on") {
      params.delete("after");
      params.delete("before");
      setBeforeDate(null);
      setAfterDate(null);
    } else if (key === "after") {
      params.delete("on");
      setOnDate(null);
    } else if (key === "before") {
      params.delete("on");
      setOnDate(null);
    } else if (key === "status") {
      setStatus(value);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="bg-dashboardBarBackground h-14 xl:w-36 w-14 xl:p-2 xl:pl-4 flex xl:justify-between justify-center items-center gap-4 rounded-full cursor-pointer">
          <p className="text-[17px] hidden xl:block">Filters</p>
          <div className="xl:w-10 xl:h-10 w-11 h-11 rounded-full xl:bg-gray flex justify-center items-center">
            <Image src={CalenderIcon} alt="Calendar Icon" className="w-5 h-5" />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent side="bottom" sideOffset={10} align="end">
        <div className="w-[392px] p-6 rounded-2xl border border-green">
          <div className="flex flex-col gap-5">
            <p className="font-medium text-xl">Filter Reports</p>

            <div className="space-y-4">
              {/* Status Dropdown */}
              <div className="w-full space-y-[2px]">
                <p className="text-green font-medium">Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full relative">
                    <input
                      type="text"
                      placeholder="Select Status"
                      readOnly
                      value={getStatusLabel(status)}
                      className="w-full border border-green p-3 h-10 rounded-lg focus:outline-none cursor-pointer"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex justify-center items-center">
                      <Image
                        src={DropDownIcon}
                        alt="Dropdown Icon"
                        className="w-3 h-3"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-full border border-green rounded-lg bg-white min-w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                          status === option.value ? "bg-green-50" : ""
                        }`}
                        onClick={() => updateQuery("status", option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors border-t border-gray-200"
                      onClick={() => updateQuery("status", null)}
                    >
                      Clear Selection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* On a date */}
              <div className="w-full space-y-[2px]">
                <p className="text-green font-medium">On a date</p>
                <Popover modal={false}>
                  <PopoverTrigger className="w-full relative">
                    <input
                      type="text"
                      placeholder="Select Date"
                      readOnly
                      value={formatDate(onDate)}
                      className="w-full border border-green p-3 h-10 rounded-lg focus:outline-none cursor-auto"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex justify-center items-center">
                      <Image
                        src={CalenderInputIconV2}
                        alt="Dropdown Icon"
                        className="w-5 h-5"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" sideOffset={10} align="end">
                    <Calendar
                      mode="single"
                      selected={onDate || undefined}
                      disabled={{ after: new Date() }}
                      onSelect={(date) => {
                        if (!date) return;
                        setOnDate(date);
                        updateQuery("on", formatDate(date));
                      }}
                      showOutsideDays={false}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* After & Before */}
              <div className="flex gap-6">
                <div className="w-full space-y-[2px]">
                  <p className="text-green font-medium">After a date</p>
                  <Popover modal={false}>
                    <PopoverTrigger className="w-full relative">
                      <input
                        type="text"
                        placeholder="Select Date"
                        readOnly
                        value={formatDate(afterDate)}
                        className="w-full border border-green p-3 h-10 rounded-lg focus:outline-none cursor-auto"
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex justify-center items-center">
                        <Image
                          src={CalenderInputIconV2}
                          alt="Dropdown Icon"
                          className="w-5 h-5"
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" sideOffset={10} align="end">
                      <Calendar
                        mode="single"
                        selected={afterDate || undefined}
                        disabled={{ after: new Date() }}
                        onSelect={(date) => {
                          if (!date) return;
                          setAfterDate(date);
                          updateQuery("after", formatDate(date));
                        }}
                        showOutsideDays={false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="w-full space-y-[2px]">
                  <p className="text-green font-medium">Before a date</p>
                  <Popover modal={false}>
                    <PopoverTrigger className="w-full relative">
                      <input
                        type="text"
                        placeholder="Select Date"
                        readOnly
                        value={formatDate(beforeDate)}
                        className="w-full border border-green p-3 h-10 rounded-lg focus:outline-none cursor-auto"
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex justify-center items-center">
                        <Image
                          src={CalenderInputIconV2}
                          alt="Dropdown Icon"
                          className="w-5 h-5"
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" sideOffset={10} align="end">
                      <Calendar
                        mode="single"
                        selected={beforeDate || undefined}
                        disabled={{ after: new Date() }}
                        onSelect={(date) => {
                          if (!date) return;
                          setBeforeDate(date);
                          updateQuery("before", formatDate(date));
                        }}
                        showOutsideDays={false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
