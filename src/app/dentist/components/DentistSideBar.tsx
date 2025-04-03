"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowDark } from "@/assets";
import AspireLogo from "@/components/AspireLogo";
import Link from "next/link";

export const PATIENT_NAMES = [
  "Emily Thompson",
  "James Anderson",
  "Sophia Martinez",
  "Michael Robinson",
  "Olivia Carter",
  "William Johnson",
  "Ava Hernandez",
  "Benjamin Lewis",
  "Isabella Scott",
  "Daniel Walker",
  "Mia Rodriguez",
  "Ethan Hall",
  "Charlotte Perez",
  "Henry Adams",
  "Amelia Wright",
  "Lucas Cooper",
  "Harper Edwards",
  "Alexander Morris",
  "Evelyn Bell",
  "Samuel Rivera",
];

export default function DentistSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(PATIENT_NAMES);

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

  // Filter and sort patient names
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(PATIENT_NAMES);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();

    const sortedPatients = PATIENT_NAMES.filter((name) =>
      name.toLowerCase().includes(lowerSearch)
    ).sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      const aStartsWith = aLower.startsWith(lowerSearch);
      const bStartsWith = bLower.startsWith(lowerSearch);

      if (aStartsWith && !bStartsWith) return -1; // a comes first
      if (!aStartsWith && bStartsWith) return 1; // b comes first
      return aLower.localeCompare(bLower); // Default alphabetical sorting
    });

    setFilteredPatients(sortedPatients);
  }, [searchTerm]);

  return (
    <>
      <div
        className="lg:hidden p-4 cursor-pointer bg-feeguidedark"
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
        <AspireLogo navigationLink={"/dentist"} />

        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
          <h2 className="text-xl font-opus">REFERRALS HISTORY</h2>
          <div className="flex flex-col gap-2 lg:gap-4">
            <p className="text-lg font-opus">Search Patients</p>
            <div
              className="flex items-center border px-3 py-3 md:text-[16px] text-[10px] rounded-[10px] w-[220px] h-[40px] lg:w-[312px] md:w-[215px] md:h-[42px] lg:h-[52px]"
              style={{ borderColor: "#000000" }}
            >
              <input
                type="text"
                name="searchPatient"
                placeholder="Name of Patient"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border-none focus:outline-none w-full text-trueBlack bg-transparent font-opus"
                style={{
                  caretColor: "#382F26",
                }}
              />
              <Image src={ArrowDark} alt="Submit Arrow" />
            </div>
          </div>

          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 max-h-80 overflow-y-scroll scrollbar">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((name, index) => (
                <Link
                  key={index}
                  className="font-opus"
                  href={`/dentist/patient-treatment/${name}`}
                >
                  {name}
                </Link>
              ))
            ) : (
              <p className="font-opus text-red-500">Patient not found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
