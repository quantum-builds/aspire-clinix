"use client";

import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";
import { TimeIconV2 } from "@/assets";
import { TPractice } from "@/types/practice";
import { formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { useState } from "react";

export default function PracticeDetails({ practice }: { practice: TPractice }) {
  const availableDays = Object.keys(
    practice.openingHours
  ) as (keyof typeof practice.openingHours)[];

  const DAYS = availableDays.map((day) => ({
    value: day.toLowerCase(),
    label: day,
  }));

  const [selectedDay, setSelectedDay] = useState(DAYS[0]?.value || "");

  const getOpeningHoursForDay = (day: string) => {
    if (!day) return { openingTime: "-", closingTime: "-" };

    const dayKey = (day.charAt(0).toUpperCase() +
      day.slice(1)) as keyof typeof practice.openingHours;
    const hours = practice.openingHours[dayKey];

    if (!hours) return { openingTime: "-", closingTime: "-" };

    return {
      openingTime: formatTime(hours.open),
      closingTime: formatTime(hours.close),
    };
  };

  const openingHour = getOpeningHoursForDay(selectedDay);

  return (
    <div className="bg-dashboardBarBackground rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xl text-green font-medium">
          Practice Details{" "}
          <span className="italic font-medium">
            (Practice ID. PRA {practice.id})
          </span>
        </p>
        {DAYS.length > 0 && (
          <Dropdown
            options={DAYS}
            value={selectedDay}
            onValueChange={setSelectedDay}
            placeholder="Select Day"
          />
        )}
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
        <p className="text-[17px] truncate">Name: {practice.name}</p>
        <p className="text-[17px] truncate">Email: {practice.email}</p>
        <p className="text-[17px] truncate">Phone: {practice.phoneNumber}</p>
        <p className="text-[17px] truncate">Postcode: {practice.postcode}</p>
        <p className="text-[17px] truncate">Time zone: {practice.timeZone}</p>
        <p className="text-[17px] truncate">Town: {practice.town}</p>

        <div className="flex items-center gap-2">
          <p className="text-[17px]">Opening Hours: </p>
          <div className="flex items-center gap-1">
            <Image src={TimeIconV2} alt="Time icon" className="w-4 h-4" />
            <span className="text-[17px]">{openingHour.openingTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-[17px]">Closing Hours: </p>
          <div className="flex items-center gap-1">
            <Image src={TimeIconV2} alt="Time icon" className="w-4 h-4" />
            <span className="text-[17px]">{openingHour.closingTime}</span>
          </div>
        </div>

        <p className="text-[17px]">NHS: {practice.nhs ? "True" : "False"}</p>
        <p className="text-[17px] xl:col-span-3  truncate">
          Address: {practice.addressLine1}
        </p>
      </div>
    </div>
  );
}
