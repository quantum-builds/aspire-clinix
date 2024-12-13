"use client";
import { Controller } from "react-hook-form";

interface CheckboxInputProps {
  name: string;
  label: string;
  value: string;
  control: any;
}

export function CheckboxInput({
  name,
  label,
  value,
  control,
}: CheckboxInputProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="checkbox"
            checked={field.value?.includes(value) || false}
            onChange={(e) => {
              const isChecked = e.target.checked;
              field.onChange(
                isChecked
                  ? [...(field.value || []), value]
                  : field.value.filter((item: string) => item !== value)
              );
            }}
          />
        )}
      />
      <label className="text-lg">{label}</label>
    </div>
  );
}
