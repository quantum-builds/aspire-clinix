"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import {
  DropDownIcon,
  ProfileIcon,
  LogoutIcon,
  HarryKaneImage,
} from "@/assets";
import {
  useGetPatient,
  useGetFamilyMembers,
  useSwitchFamilyMember,
} from "@/services/patient/patientMutation";

interface UserMenuProps {
  profileLink: string;
  onLogout: () => void;
}

type DisplayedFamilyMember = {
  name: string;
  image: string | StaticImageData;
  dentallyId: string;
};

export function UserMenu({ profileLink, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: getPatient } = useGetPatient();
  const { mutateAsync: fetchFamilyMembers, data: familyMembers } =
    useGetFamilyMembers();
  const { mutateAsync: switchFamilyMember } = useSwitchFamilyMember();

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
    const fetchPatientFamilyId = async () => {
      try {
        const patient = await getPatient();
        const patientFamilyId = patient?.familyId;
        const patientId = patient?.id;
        console.log("UserMenu: patient familyId:", patientFamilyId, "patientId:", patientId);
        if (patientFamilyId) {
          setFamilyId(patientFamilyId);
        }
        if (patientId) {
          setCurrentPatientId(Number(patientId));
        }
      } catch (err) {
        console.error("UserMenu: failed to fetch patient familyId", err);
      }
    };
    fetchPatientFamilyId();
  }, [getPatient]);

  useEffect(() => {
    if (!familyId) return;
    console.log("UserMenu: triggering fetchFamilyMembers with familyId:", familyId);
    void fetchFamilyMembers({ familyId });
  }, [familyId, fetchFamilyMembers]);

  const handleSwitch = async (targetDentallyId: string) => {
    setSwitchingId(targetDentallyId);
    try {
      await switchFamilyMember({ targetDentallyId });
      setOpen(false);
      window.location.reload();
    } catch {
      setSwitchingId(null);
    }
  };

  const displayedFamilyMember: DisplayedFamilyMember[] =
    familyMembers && familyMembers.length > 0
      ? familyMembers
          .map((member) => {
            const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`
              .trim()
              .replace(/\s+/g, " ");

            return {
              name: fullName,
              image: member.imageUrl || HarryKaneImage,
              dentallyId: String(member.dentallyId ?? member.id ?? ""),
            };
          })
          .filter((m) => Number(m.dentallyId) !== currentPatientId)
      : [];

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
                  <button
                    key={user.dentallyId}
                    onClick={() => handleSwitch(user.dentallyId)}
                    disabled={switchingId === user.dentallyId}
                    className="flex items-center gap-2 w-full text-left hover:bg-gray-100 rounded px-2 py-1 disabled:opacity-50"
                  >
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">
                      {switchingId === user.dentallyId ? "Switching..." : user.name}
                    </span>
                  </button>
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
