"use client";

import { DownIcon, UpIcon, ArrowLeftIcon } from "@/assets";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { UserRoles } from "@/constants/UserRoles";

const USER_MENU_LIST = [
  {
    category: "ASPIRE CLINIC",
    path: "/",
    services: [{ title: "Our Philosophy", path: "/our-philopsophy" }],
  },
  {
    category: "DENTISTRY",
    path: "/dentistry",
    services: [
      { title: "General", path: "/general-dentistry" },
      { title: "Cosmetic", path: "/services/cosmetic" },
      { title: "Emergency", path: "/services/emergency" },
      { title: "Implants", path: "/services/implants" },
      { title: "Gums", path: "/services/gums" },
      { title: "Oral Surgery", path: "/services/surgery" },
      { title: "Dentures", path: "/services/dentures" },
      { title: "Root Canals", path: "/services/root" },
      { title: "Orthodontic", path: "/services/orthodontic" },
      { title: "Kids", path: "/services/kid" },
    ],
  },
  {
    category: "AESTHETICS",
    path: "/asthetics",
    services: [
      { title: "Anti Wrinkle Injections", path: "/services/anti-wrinkle" },
      { title: "Fillers", path: "/services/fillers" },
      { title: "Skin Boosters", path: "/services/boosters" },
    ],
  },
  {
    category: "WELLNESS",
    path: "/wellness",
    services: [
      { title: "Cryotherapy", path: "/services/cryotherapy-chamber" },
      { title: "Infra-red Sauna", path: "/services/sauna" },
      { title: "Contrast Therapy", path: "/services/contrast" },
      { title: "Hyperbaric Oxygen", path: "/services/oxygen" },
      { title: "Ice Baths", path: "/services/ice" },
      { title: "Massage", path: "/services/massage" },
      { title: "Compression Therapy", path: "/services/compression" },
      { title: "IV Lounge", path: "/services/lounge" },
    ],
  },
  { category: "FEE GUIDE", path: "/fee-guide", services: [] },
  {
    category: " PATIENT PORTAL",
    path: "/patient/appointments/upcoming",
    services: [],
  },
  {
    category: "REFERRAL FORM",
    path: "/referral",
    services: [],
  },
  {
    category: "MEET THE TEAM",
    path: "/meet-the-team",
    services: [],
  },
  {
    category: "CONTACT",
    path: "/contact-us",
    services: [],
  },
  { category: "PRIVACY POLICY", path: "/privacy-policy", services: [] },
  {
    category: "ASPIRE DENTAL ACADEMY",
    path: "/aspire",
    services: [],
  },
];

const ADMIN_MENU_LIST = [
  { category: "Dashboard Overview", path: "/admin", services: [] },
  { category: "User Management", path: "/admin", services: [] },
  { category: "Appointment Management", path: "/admin", services: [] },
  { category: "Reports & Analytics", path: "/admin", services: [] },
  { category: "Payment Transactions", path: "/admin", services: [] },
  { category: "Settings", path: "/admin", services: [] },
];
interface MenuProps {
  menuStatus: boolean;
  setMenuStatus: Dispatch<SetStateAction<boolean>>;
  role: string;
}

export default function Menu({ menuStatus, setMenuStatus, role }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const handleCategoryClick = (category: string) => {
    setActiveCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };
  const MENU_LIST = role === UserRoles.ADMIN ? ADMIN_MENU_LIST : USER_MENU_LIST;

  return (
    <nav
      className={` w-full lg:w-[40%] md:w-[60%] xl:w-[30%] z-50 h-screen bg-menuBar fixed top-0 left-0 px-12 pt-20 pb-15 trasnform ${
        menuStatus ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-500 ease-in-out font-gillSans `}
    >
      <Image
        className="absolute right-12 top-14 cursor-pointer"
        src={ArrowLeftIcon}
        alt="Close Menu"
        onClick={() => setMenuStatus(false)}
      />
      <ul className="zoom-out space-y-4 overflow-y-auto h-[90%] scrollbar ">
        {MENU_LIST.map((categoryData, index) => (
          <li key={index} className="">
            <div className="flex items-center">
              <span
                className={`w-[60%] text-left text-[20px] text-nowrap md:text-2xl py-2 px-4 leading-[27.27px] ${
                  categoryData.path ? "cursor-pointer" : ""
                }`}
              >
                {categoryData.path ? (
                  <Link href={categoryData.path}>{categoryData.category}</Link>
                ) : (
                  categoryData.category
                )}
              </span>
              {categoryData.services.length > 0 && (
                <Image
                  src={
                    activeCategory === categoryData.category ? UpIcon : DownIcon
                  }
                  onClick={() => {
                    handleCategoryClick(categoryData.category);
                  }}
                  alt="Menu Action"
                  className="cursor-pointer"
                />
              )}
            </div>
            {activeCategory === categoryData.category &&
              categoryData.services.length > 0 && (
                <ul
                  className={`pl-4 mt-2 space-y-2 overflow-y-auto scrollbar md:h-full ${
                    categoryData.services.length > 3 ? "h-[170px]" : "h-auto"
                  }`}
                >
                  {categoryData.services.map((service, idx) => (
                    <li key={idx}>
                      <Link
                        href={service.path}
                        className="text-[16px] md:text-xl leading-{22.72px} tracking-widest"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
