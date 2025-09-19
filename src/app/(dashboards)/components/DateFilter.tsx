"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { CalenderGreenIcon, CalenderIcon } from "@/assets";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [onDate, setOnDate] = useState<Date | null>(null);
  const [afterDate, setAfterDate] = useState<Date | null>(null);
  const [beforeDate, setBeforeDate] = useState<Date | null>(null);

  useEffect(() => {
    const on = searchParams.get("on");
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    if (on) setOnDate(new Date(on));
    if (after) setAfterDate(new Date(after));
    if (before) setBeforeDate(new Date(before));
  }, [searchParams]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <button className="bg-white h-15 w-36 p-2 pl-5 flex justify-between items-center gap-4 rounded-full cursor-pointer">
          <p>Filters</p>
          <div className="w-11 h-11 rounded-full bg-[#F3F5F7] flex justify-center items-center">
            <Image src={CalenderIcon} alt="Calendar Icon" className="w-5 h-5" />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent side="bottom" sideOffset={10} align="end">
        <div className="w-[392px] h-[250px] p-6 rounded-2xl border border-green">
          <div className="flex flex-col gap-5">
            <p className="font-medium text-xl">Filter Reports</p>

            <div className="space-y-3">
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
                        src={CalenderGreenIcon}
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
                          src={CalenderGreenIcon}
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
                          src={CalenderGreenIcon}
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
