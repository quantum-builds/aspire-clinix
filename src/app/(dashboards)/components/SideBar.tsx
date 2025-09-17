"use client";

import { useState, useEffect } from "react";
import { ActiveIcon, AspireDarkLogo, BackToWebsiteIcon } from "@/assets";
import Image from "next/image";
import Button from "@/app/(dashboards)/components/Button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarPage } from "@/types/common";

interface SideBarProps {
  sideBarContnent: SidebarPage[];
}
export default function Sidebar({ sideBarContnent }: SideBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let matched = false;

    sideBarContnent.forEach((section) => {
      if (section.pages) {
        section.pages.forEach((page) => {
          if (page.href && pathname.startsWith(page.href)) {
            setActiveSection(section.name);
            setOpenSection(section.name);
            setActivePage(page.name);
            matched = true;
          }
        });
        if (section.href && !matched) {
          setActiveSection(section.name);
          setOpenSection(null);
          setActivePage(null);
          matched = true;
        }
      } else if (section.href && pathname.startsWith(section.href)) {
        setActiveSection(section.name);
        setOpenSection(null);
        setActivePage(null);
        matched = true;
      }
    });

    if (!matched) {
      console.log("in not matched");
      setActiveSection(null);
      setOpenSection(null);
      setActivePage(null);
    }
  }, [pathname]);

  const handleSectionClick = (
    section: { name: string; href?: string },
    havePages: boolean
  ) => {
    setActiveSection(section.name);
    if (havePages) {
      setOpenSection((prev) => (prev === section.name ? null : section.name));
    } else {
      if (section.href) router.push(section.href);
      setOpenSection(null);
      setActivePage(null);
    }
  };

  return (
    <div className="w-[344px] h-screen bg-dashboardBarBackground border-r border-gray-200 py-4 pb-12 px-8 flex flex-col justify-between font-medium fixed">
      <div className="flex flex-col gap-6">
        <div className="w-full flex items-center justify-center">
          <Image
            src={AspireDarkLogo}
            alt="Aspire Logo"
            width={129}
            height={60}
          />
        </div>
        <p className="text-base">MENU</p>
        <nav>
          {sideBarContnent.map((section) => {
            const isActiveSection = activeSection === section.name;

            return (
              <div key={section.name} className="mb-4">
                <button
                  onClick={() => {
                    if (section.pages) {
                      handleSectionClick(section, true);
                    } else {
                      handleSectionClick(section, false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-2xl transition 
                  ${
                    isActiveSection
                      ? "bg-black text-white"
                      : "hover:bg-gray-50 text-dashboardTextBlack"
                  }`}
                >
                  <div className="flex items-center">
                    <Image
                      src={section.icon}
                      alt={`${section.name} Icon`}
                      className={`w-5 h-5 mr-2 ${
                        isActiveSection ? "invert brightness-0" : ""
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {section.name}
                    </span>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    openSection === section.name ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {section.pages && (
                    <ul className="mt-2 pl-10 space-y-2">
                      {section.pages.map((page) => (
                        <li key={page.name}>
                          <Link
                            href={page.href ? page.href : "/"}
                            className={`flex items-center transition ${
                              activePage === page.name
                                ? "text-primary font-semibold"
                                : "hover:text-primary"
                            }`}
                            onClick={() => {
                              setActivePage(page.name);
                            }}
                          >
                            <Image
                              src={
                                activePage === page.name
                                  ? ActiveIcon
                                  : page.icon
                              }
                              alt={`${page.name} Icon`}
                              className="w-4 h-4 mr-2"
                            />
                            {page.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
      <Button text="Back to Website" icon={BackToWebsiteIcon} href="/" />
    </div>
  );
}
