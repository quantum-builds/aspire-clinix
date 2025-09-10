"use client";
import { Controller } from "react-hook-form";

interface CheckboxInputProps {
  name: string;
  label: string;
  value: string;
  control: any;
  type: "checkbox" | "radio";
  radioName?: string;
}

export function CheckboxInput({
  name,
  label,
  value,
  control,
  type,
  radioName,
}: CheckboxInputProps) {
  return (
    <div className="flex items-center gap-2 mb-4 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type={type}
            name={type === "radio" ? radioName : undefined}
            checked={
              type === "radio"
                ? field.value === value
                : Array.isArray(field.value)
                ? field.value.includes(value)
                : Boolean(field.value)
            }
            onChange={(e) => {
              const isChecked = e.target.checked;
              console.log("is checked", isChecked);

              if (type === "radio") {
                field.onChange(value); // Ensure radio updates correctly
              } else {
                field.onChange(
                  isChecked
                    ? [...(field.value || []), value]
                    : field.value?.filter((item: string) => item !== value) ||
                        []
                );
              }
            }}
            className="w-4 h-4 md:w-[27px] md:h-[27px] mr-4 border-[#000000] border-[0.75px] rounded-[5px] appearance-none bg-[#ECE8E3] checked:text-black checked:bg-[#ECE8E3] flex items-center justify-center flex-shrink-0 checked:before:content-['✔'] checked:before:text-base"
          />
        )}
      />
      <label className="text-[18px] md:text-[22px] lg:text-[25px]">
        {label}
      </label>
    </div>
  );
}
