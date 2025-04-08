"use client";

import { DownIcon, UpIcon, ArrowLeftIcon } from "@/assets";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { UserRoles } from "@/constants/UserRoles";
import { routeModule } from "next/dist/build/templates/app-page";
import path from "path";

const USER_MENU_LIST = [
  {
    category: "ASPIRE CLINIC",
    path: "/",
    services: [{ title: "Our Philosophy", path: "/our-philosophy" }],
  },
  {
    category: "DENTISTRY",
    path: "/dentistry",
    services: [
      { title: "General", path: "/general-dentistry" },
      { title: "Cosmetic", path: "/service-page" },
      { title: "Emergency", path: "/service-page" },
      { title: "Implants", path: "/service-page" },
      { title: "Gums", path: "/service-page" },
      { title: "Oral Surgery", path: "/service-page" },
      { title: "Dentures", path: "/service-page" },
      { title: "Root Canals", path: "/service-page" },
      { title: "Orthodontic", path: "/service-page" },
      { title: "Kids", path: "/service-page" },
    ],
  },
  {
    category: "AESTHETICS",
    path: "/asthetics",
    services: [
      { title: "Anti Wrinkle Injections", path: "/service-page/" },
      { title: "Fillers", path: "/service-page" },
      { title: "Skin Boosters", path: "/service-page" },
    ],
  },
  {
    category: "WELLNESS",
    path: "/wellness",
    services: [
      { title: "Cryotherapy", path: "/service-page" },
      { title: "Infra-red Sauna", path: "/service-page" },
      { title: "Contrast Therapy", path: "/service-page" },
      { title: "Hyperbaric Oxygen", path: "/service-page" },
      { title: "Ice Baths", path: "/service-page" },
      { title: "Massage", path: "/service-page" },
      { title: "Red Light Therapy", path: "/service-page" },
      { title: "Compression Therapy", path: "/service-page" },
      { title: "IV Lounge", path: "/service-page" },
      { title: "Longevity Concierge", path: "/service-page" },
    ],
  },
  { category: "FEE GUIDE", path: "/fee-guide", services: [] },
  {
    category: " PATIENT PORTAL",
    path: "/patient",
    services: [],
  },
  {
    category: "REFERRAL PORTAL",
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
