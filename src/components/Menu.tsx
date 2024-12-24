"use client";

import { DownIcon, UpIcon, ArrowLeftIcon } from "@/assets";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

const MENU_LIST = [
  {
    category: "ASPIRE",
    services: [{ title: "Our Philosophy", path: "/" }],
  },
  {
    category: "DENTISTRY",
    services: [
      { title: "General", path: "/dentistry" },
      { title: "Cosmetic", path: "/" },
      { title: "Emergency", path: "/" },
      { title: "Implants", path: "/" },
      { title: "Gums", path: "/" },
      { title: "Oral Surgery", path: "/" },
      { title: "Dentures", path: "/" },
      { title: "Root Canals", path: "/" },
      { title: "Orthodontic", path: "/" },
      { title: "Kids", path: "/" },
    ],
  },
  {
    category: "AESTHETICS",
    services: [
      { title: "Anti Wrinkle Injections", path: "/" },
      { title: "Fillers", path: "/" },
      { title: "Skin Boosters", path: "/" },
    ],
  },
  {
    category: "WELLNESS",
    services: [
      { title: "Cryotherapy", path: "/" },
      { title: "Infra-red Sauna", path: "/" },
      { title: "Contrast Therapy", path: "/" },
      { title: "Hyperbaric Oxygen", path: "/" },
      { title: "Ice Baths", path: "/" },
      { title: "Massage", path: "/" },
      { title: "Red Light Therapy", path: "/" },
      { title: "Compression Therapy", path: "/" },
      { title: "IV Lounge", path: "/" },
      { title: "Longevity Concierge", path: "/" },
    ],
  },
  {
    category: "REFERRAL PORTAL",
    services: [],
  },
  {
    category: "ASPIRE DENTAL ACADEMY",
    services: [],
  },
  {
    category: "CONTACT",
    services: [],
  },
];

interface MenuProps {
  menuStatus: boolean;
  setMenuStatus: Dispatch<SetStateAction<boolean>>;
}

export default function HeroMenu({ menuStatus, setMenuStatus }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const handleCategoryClick = (category: string) => {
    setActiveCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  return (
    <nav
      className={` w-full lg:w-[40%] md:w-[75%] min-h-screen bg-menuBar absolute top-0 left-0 px-12 pt-20 pb-15 trasnform ${
        menuStatus ? "translate-x-0" : "translate-x-[-100%]"
      } transition-transform duration-500 ease-in-out font-gillSans`}
    >
      <Image
        className="absolute right-12 top-14 cursor-pointer"
        src={ArrowLeftIcon}
        alt="Close Menu"
        onClick={() => setMenuStatus(false)}
      />
      <ul className="space-y-4 lg:overflow-y-auto scrollbar-none lg:h-[800px]">
        {MENU_LIST.map((categoryData, index) => (
          <li key={index} className="">
            <div className="flex items-center">
              <span className="w-[60%] text-left text-[20px] text-nowrap md:text-2xl py-2 px-4 leading-{27.27px}">
                {categoryData.category}
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
                <ul className="pl-4 mt-2 space-y-2">
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
