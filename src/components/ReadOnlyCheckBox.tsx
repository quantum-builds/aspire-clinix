"use client";
import React from "react";

interface ReadOnlyCheckboxProps {
  label: string;
  checked: boolean;
}


export function ReadOnlyCheckbox({ label, checked }: ReadOnlyCheckboxProps) {
  return (
    <div className="flex items-center gap-2 mb-4 w-full">
      <div
        className={`w-4 h-4 md:w-[22px] md:h-[22px] mr-1  rounded-[5px] bg-gray flex items-center justify-center ${checked ? "text-green before:content-['✔'] before:text-green" : ""
          }`}
      />
      <label className="text-lg select-none">
        {label}
      </label>
    </div>
  );
}
