// components/ui/Dropdown.tsx
"use client";

import { DropDownIcon } from "@/assets";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export default function Dropdown({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className = "",
  triggerClassName = "",
  contentClassName = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        className={`
          flex gap-3 items-center cursor-pointer select-none
          ${triggerClassName}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-[17px] italic text-green">
          {selectedOption?.label || placeholder}
        </p>
        <Image
          src={DropDownIcon}
          alt="Dropdown"
          className={`size-4 mt-[2px] transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`
        absolute top-10 right-0 rounded-2xl py-4 px-4 space-y-[6px] bg-gray shadow-lg
        transition-all duration-300 ease-in-out z-10 min-w-[160px]
        ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
        }
        ${contentClassName}
      `}
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            className={`
              font-light cursor-pointer transition-colors duration-200
              ${
                value === option.value
                  ? "text-green font-medium"
                  : "text-gray-700 hover:text-green"
              }
            `}
            onClick={() => handleSelect(option.value)}
          >
            <div className="py-1 px-2 rounded-lg hover:bg-green/10 transition-colors">
              {option.label}
            </div>
            {index < options.length - 1 && (
              <div className="bg-green/30 h-[1px] my-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
