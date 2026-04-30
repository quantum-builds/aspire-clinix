"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  DropDownIcon,
  ProfileIcon,
  LogoutIcon,
  HarryKaneImage,
} from "@/assets";
import { useGetFamilyMembers } from "@/services/patient/patientMutation";

interface UserMenuProps {
  profileLink: string;
  onLogout: () => void;
 
}
const users: { name: string; image: any }[] = [];

export function UserMenu({ profileLink, onLogout  }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const familyId = searchParams.get("familyId")?.trim() || "";
  const { mutateAsync: fetchFamilyMembers, data: familyMembers } =
    useGetFamilyMembers();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!familyId) return;
    void fetchFamilyMembers({ familyId });
  }, [familyId, fetchFamilyMembers]);

  const displayedFamilyMember =
    familyMembers && familyMembers.length > 0
      ? familyMembers.map((member) => {
          const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`
            .trim()
            .replace(/\s+/g, " ");

          return {
            name: fullName,
            image: HarryKaneImage,
          };
        })
      : users;

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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <ul className="flex flex-col py-1">
            <li className="px-3 py-2">
              <div className="flex flex-col gap-2">
                {displayedFamilyMember.map((user) => (
                  <div key={user.name} className="flex items-center gap-2">
                    <Image
                      src={user.image}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                ))}
              </div>
            </li>
            <li className="border-t border-gray-200 my-1"></li>
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
