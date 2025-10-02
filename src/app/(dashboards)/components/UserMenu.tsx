"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DropDownIcon, ProfileIcon, LogoutIcon } from "@/assets";

interface UserMenuProps {
  profileLink: string;
  onLogout: () => void;
}

export function UserMenu({ profileLink, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-11 h-11 rounded-full bg-[#F3F5F7] flex justify-center items-center outline-none"
      >
        <Image
          src={DropDownIcon}
          alt="Dropdown Icon"
          className="w-[14px] h-[8px]"
        />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <ul className="flex flex-col py-1">
            <li>
              <Link
                href={profileLink}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
              >
                <Image
                  src={ProfileIcon}
                  alt="Profile Icon"
                  className="w-4 h-4"
                />
                Profile
              </Link>
            </li>
            <li className="border-t border-gray-200 my-1"></li>
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
              >
                <Image src={LogoutIcon} alt="Logout Icon" className="w-4 h-4" />
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
