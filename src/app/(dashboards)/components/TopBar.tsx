"use client";
import {
  CalenderIcon,
  HarryKaneImage,
  LogoutIconV2,
  NotificationIcon,
} from "@/assets";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Notifications from "./Notifications";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { signOutMutation } from "@/services/signOutMutation";
import { UserMenu } from "./UserMenu";
import CustomPopover from "./custom-components/Popover";

interface TopBarProps {
  name: string;
  profilePic: string | null | undefined;
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

  console.log("profile pic is ", profilePic)
  return (
    <div className="fixed top-0 left-[320px] w-[calc(100%-320px)] h-[90px] bg-dashboardBarBackground border-b border-gray-200 flex items-center justify-end gap-8 px-6 z-10">
      {/* <Popover>
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
      </Popover> */}

      <CustomPopover
        trigger={
          <Image
            src={CalenderIcon}
            alt="Calendar Icon"
            className="w-5 h-5 cursor-pointer"
          />
        }
      >
        <Calendar mode="single" selected={new Date()} showOutsideDays={false} />
      </CustomPopover>

      <CustomPopover
        trigger={
          <Image
            src={NotificationIcon}
            alt="Notification Icon"
            className="w-5 h-5 cursor-pointer"
          />
        }
        className="w-96 max-w-7xl"
      >
        <Notifications />
      </CustomPopover>
      <div className="flex gap-3 items-center">
        <Image
          src={HarryKaneImage}
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
