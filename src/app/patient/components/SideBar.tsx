"use client"; // Ensure it's a Client Component

import { useState, useEffect } from "react";
import AspireLogo from "../book-treatment/components/AspireLogo";
import { Menu, X } from "lucide-react"; // Icons for open/close
import Image from "next/image"; // Import Image component
import { ArrowLeftIcon } from "@/assets";
import Link from "next/link";

const SIDEBAR_DATA = [
  { title: "APPOINTMENTS", link: "/patient" },
  { title: "PLANS, PACKAGES & SUBSCRIPTIONS", link: "/patient" },
  { title: "RESOURCES", link: "/patient/resources" },
  { title: "CONSENT", link: "/patient" },
  { title: "STORE", link: "/patient" },
];

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(".sidebar")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div
        className="lg:hidden p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={30} /> : <Menu size={30} />}
      </div>

      <div
        className={`sidebar bg-feeGuide lg:w-1/5 min-h-screen lg:px-10 lg:py-10 flex flex-col gap-20 
        ${
          isOpen
            ? "fixed left-0 top-0 w-full md:w-1/3 h-full p-6 shadow-lg z-50"
            : "hidden lg:flex"
        }`}
      >
        <Image
          className="lg:hidden absolute right-12 top-14 cursor-pointer"
          src={ArrowLeftIcon}
          alt="Close Menu"
          onClick={() => setIsOpen(false)}
          priority
        />
        <AspireLogo navigationLink={"/patient"} />
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 ">
          {SIDEBAR_DATA.map((data, index) => (
            <Link href={data.link}>
              <p
                key={index}
                className="text-lg lg:text-xl xl:text-2xl font-normal font-opus cursor-pointer"
              >
                {data.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
