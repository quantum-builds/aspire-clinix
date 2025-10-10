"use client";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface MenuOption {
  label: string;
  onClick: () => void;
}

interface TableActionMenuProps {
  options: MenuOption[];
}

export function TableActionMenu({ options }: TableActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;

        // Get the computed zoom level
        const zoom = parseFloat(getComputedStyle(document.documentElement).zoom || '1');

        // Calculate position - align to the right of the trigger
        const left = (rect.right / zoom) + scrollX - 144;
        const top = (rect.bottom / zoom) + scrollY + 8;

        setMenuPosition({ top, left });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const menu = isOpen && mounted && options.length > 0 ? (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
      className="w-36 bg-white rounded-md shadow-lg border border-green z-[9999] "
    >
      <ul className="flex flex-col py-1">
        {options.map((option, index) => (
          <li key={index}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                option.onClick();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:text-green text-sm"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  if (options.length === 0) {
    return (
      <p className="text-gray-400 italic text-base">No actions found</p>
    );
  }

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <MoreVertical className="h-5 w-5" />
      </Button>
      {mounted && createPortal(menu, document.body)}
    </>
  );
}