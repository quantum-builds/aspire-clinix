"use client";

import { NotificationBell, ProfilePic, DownIcon, UpIcon } from "@/assets";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const notifications = [
  {
    id: 1,
    message: "You have a new message from John.",
    redirectTo: "/admin",
  },
  {
    id: 2,
    message: "Your appointment is scheduled for tomorrow.",
    redirectTo: "/admin",
  },
  {
    id: 3,
    message: "Reminder: Update your profile.",
    redirectTo: "/admin",
  },
];

const profileMenus = [
  {
    label: "My Account",
    redirectTo: "/admin",
  },
  {
    label: "Logout",
    redirectTo: "/admin",
  },
];

export default function DropDown() {
  const [profileDropdown, setProfileDropDown] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleNotificationDropdown = () => {
    setNotificationDropdown(!notificationDropdown);
    setProfileDropDown(false);
  };

  const handleProfileDropdown = () => {
    setProfileDropDown(!profileDropdown);
    setNotificationDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both dropdowns
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setProfileDropDown(false);
        setNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-5">
      <div className="relative" ref={notificationRef}>
        <Image
          src={NotificationBell}
          alt="Notifications"
          width={50}
          height={50}
          className="cursor-pointer zoom-out flex items-center justify-center"
          onClick={handleNotificationDropdown}
        />

        {notificationDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-formBackground rounded-md shadow-lg z-50">
            <ul className="py-1">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id} className="hover:bg-gray-100">
                    <Link
                      href={notification.redirectTo}
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      {notification.message}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-700">
                  No notifications
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div
        className="relative flex items-center gap-3"
        ref={profileDropdownRef}
      >
        <div className="p-3 rounded-full bg-gray-300">
          <Image
            src={ProfilePic}
            alt="Profile Picture"
            width={50}
            height={50}
            className="zoom-out flex items-center justify-center"
          />
        </div>

        <div className="flex items-center gap-2 cursor-pointer">
          <p className="text-xl hidden md:block">Massab</p>
          <Image
            src={profileDropdown === true ? UpIcon : DownIcon}
            alt="Dropdown Icon"
            width={30}
            height={30}
            className="zoom-out flex items-center justify-center"
            onClick={handleProfileDropdown}
          />
        </div>

        {profileDropdown && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-formBackground rounded-md shadow-lg z-50">
            <ul className="py-1">
              {profileMenus.map((menu, index) => (
                <li key={index} className="hover:bg-gray-100">
                  <Link
                    href={menu.redirectTo}
                    className="block px-4 py-2 text-sm text-gray-700"
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
