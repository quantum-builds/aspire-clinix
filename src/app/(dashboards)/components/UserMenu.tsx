"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  DropDownIcon,
  ProfileIcon,
  LogoutIcon,
  HarryKaneImage,
} from "@/assets";
import { useGetFamilyMembers } from "@/services/patient/patientMutation";
import { getAMedia } from "@/services/s3/s3Query";

interface UserMenuProps {
  profileLink: string;
  onLogout: () => void;
  role?: string;
  familyId?: string;
}
const users: { id: string; name: string; image: any }[] = [];

export function UserMenu({
  profileLink,
  onLogout,
  role,
  familyId: familyIdProp,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [familyMembersList, setFamilyMembersList] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const familyId =
    familyIdProp?.trim() || searchParams.get("familyId")?.trim() || "";
  const { mutateAsync: fetchFamilyMembers } = useGetFamilyMembers();

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
    void fetchFamilyMembers({ familyId: familyId || undefined }).then(
      (members) => {
        setFamilyMembersList(Array.isArray(members) ? members : []);
      },
    );
  }, [familyId, fetchFamilyMembers]);

  useEffect(() => {
    console.log(
      "family members in user menu are ",
      JSON.stringify(familyMembersList, null, 2),
    );
  }, [familyMembersList]);

  const mappedFamilyMembers =
    familyMembersList.length > 0
      ? familyMembersList.map((member) => {
          const anyMember = member as any;
          const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`
            .trim()
            .replace(/\s+/g, " ");

          const imageSource =
            anyMember.imageUrl ??
            anyMember.file?.url ??
            anyMember.fileUrl ??
            "";

          return {
            id: anyMember.id ?? anyMember.dentallyId ?? "", // Ensure id is included
            name: fullName,
            image: imageSource || HarryKaneImage,
            _fileKey: imageSource,
          };
        })
      : [];

  const displayedFamilyMember =
    role?.toLowerCase() === "patient"
      ? mappedFamilyMembers.length > 0
        ? mappedFamilyMembers
        : []
      : users;

  const handleFamilyMemberClick = async (member: {
    id: string;
    name: string;
    image: any;
  }) => {
    setOpen(false);

    await signOut({ redirect: false });

    const nextParams = new URLSearchParams();
    nextParams.set("familyMemberId", member.id);

    router.push(`/patient/login?${nextParams.toString()}`);
  };

  // enriched members with resolved image urls (S3File-like or string)
  const [enrichedMembers, setEnrichedMembers] = useState<
    {
      id: string;
      name: string;
      image: any;
    }[]
  >(displayedFamilyMember as { id: string; name: string; image: any }[]);

  useEffect(() => {
    let mounted = true;

    async function resolveImages() {
      if (!mappedFamilyMembers || mappedFamilyMembers.length === 0) {
        setEnrichedMembers(displayedFamilyMember as any);
        return;
      }

      const results: { id: string; name: string; image: any }[] = [];

      for (const m of mappedFamilyMembers) {
        const fileKey = (m as any)._fileKey;
        let imageResolved: any = m.image ?? HarryKaneImage;

        try {
          if (typeof fileKey === "string" && fileKey.length > 0) {
            // If it's already an absolute URL, use it directly
            if (/^https?:\/\//i.test(fileKey)) {
              imageResolved = fileKey;
            } else {
              const upload = await getAMedia(fileKey);
              const s3File = upload?.files?.[0] ?? null;
              imageResolved = s3File?.url ?? HarryKaneImage;
            }
          }
        } catch (err) {
          imageResolved = HarryKaneImage;
        }

        results.push({ id: m.id, name: m.name, image: imageResolved });
      }

      if (mounted) setEnrichedMembers(results);
    }

    void resolveImages();

    return () => {
      mounted = false;
    };
  }, [familyMembersList, role]);

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
                {(role?.toLowerCase() === "patient"
                  ? enrichedMembers
                  : displayedFamilyMember
                ).map((user) => (
                  <button
                    key={user.name}
                    type="button"
                    onClick={() => handleFamilyMemberClick(user)}
                    className="flex items-center gap-2 text-left cursor-pointer rounded-md px-1 py-1 hover:bg-gray-50"
                  >
                    <Image
                      src={user.image}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
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
