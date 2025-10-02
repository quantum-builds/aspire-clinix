"use client";
import {
  CalenderIcon,
  DropDownIcon,
  HarryKaneImage,
  LogoutIcon,
  LogoutIconV2,
  NotificationIcon,
  ProfileIcon,
} from "@/assets";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Notifications from "./Notifications";
import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { signOutMutation } from "@/services/signOutMutation";
import { UserMenu } from "./UserMenu";

interface TopBarProps {
  name: string;
  profilePic?: string | undefined;
  role: string;
  profileLink: string;
}

export default function TopBar({
  name,
  profilePic,
  role,
  profileLink,
}: TopBarProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: signOut, isPending } = signOutMutation();

  return (
    <div className="fixed top-0 left-[320px] w-[calc(100%-320px)] h-[90px] bg-dashboardBarBackground border-b border-gray-200 flex items-center justify-end gap-8 px-6 z-10">
      <Popover>
        <PopoverTrigger>
          <Image
            src={CalenderIcon}
            alt="Calendar Icon"
            className="w-5 h-5 cursor-pointer"
          />
        </PopoverTrigger>
        <PopoverContent side="bottom" sideOffset={10} align="end">
          <Calendar
            mode="single"
            selected={new Date()}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <Image
            src={NotificationIcon}
            alt="Calendar Icon"
            className="w-5 h-5 cursor-pointer"
          />
        </PopoverTrigger>
        <PopoverContent side="bottom" sideOffset={10} align="end">
          <Notifications />
        </PopoverContent>
      </Popover>

      <div className="flex gap-3 items-center">
        <Image
          src={profilePic || HarryKaneImage}
          alt="User Image"
          width={40}
          height={40}
          className="w-11 h-11 rounded-2xl"
        />
        <div className="flex flex-col gap-[1px]">
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-lightBlack">{role}</p>
        </div>
      </div>

      {/* <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="w-11 h-11 rounded-full bg-[#F3F5F7] flex justify-center items-center outline-none">
            <Image
              src={DropDownIcon}
              alt="Dropdown Icon"
              className="w-[14px] h-[8px]"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          sideOffset={10}
          align="end"
          className="text-dashboardTextBlack"
        >
          <DropdownMenuItem asChild>
            <Link className="flex gap-2 cursor-pointer" href={profileLink}>
              <Image src={ProfileIcon} alt="Profile Icon" className="w-4 h-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsCancelModalOpen(true);
            }}
          >
            <div className="flex gap-2 cursor-pointer">
              <Image src={LogoutIcon} alt="Calendar Icon" className="w-4 h-4" />
              LogOut
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}

      <UserMenu
        profileLink={profileLink}
        onLogout={() => setIsCancelModalOpen(true)}
      />

      <ConfirmationModal
        icon={LogoutIconV2}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={isPending}
        onConfirm={() => {
          signOut();
          setIsCancelModalOpen(false);
        }}
        title="Logout"
        description="Are you sure you want to logout"
        cancelText="Cancel"
        confirmText="Confirm"
      />
    </div>
  );
}
