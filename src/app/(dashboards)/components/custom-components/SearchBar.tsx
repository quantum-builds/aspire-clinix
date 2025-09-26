"use client";
import { SearchIcon } from "@/assets";
import Image from "next/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInputContent, setShowInputContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);

  // Focus input when expanded and handle content visibility
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
        setShowInputContent(true);
      }, 100);
    } else {
      setShowInputContent(false);
    }
  }, [isExpanded]);

  // Focus modal input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        modalInputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Handle routing search
  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  // Debounced search trigger
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, handleSearch]);

  // Collapse on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (isModalOpen) {
        setIsModalOpen(false);
      } else {
        setIsExpanded(false);
      }
    }
  };

  // Improved blur handler for desktop search
  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as Node;
    if (containerRef.current?.contains(relatedTarget)) {
      return;
    }
    setTimeout(() => setIsExpanded(false), 150);
  };

  // Handle container click more intelligently
  const handleContainerClick = () => {
    if (!isExpanded) {
      // Check if we're on a small screen
      if (window.innerWidth < 1280) {
        // xl breakpoint (1280px)
        setIsModalOpen(true);
      } else {
        setIsExpanded(true);
      }
    }
  };

  // Handle modal input blur
  const handleModalBlur = (e: React.FocusEvent) => {
    // Only close if clicking outside the modal
    const relatedTarget = e.relatedTarget as Node;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsModalOpen(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isModalOpen &&
        !containerRef.current?.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  return (
    <>
      <div className="relative">
        <div
          ref={containerRef}
          className={`flex items-center gap-2 h-14 transition-all duration-300 ease-in-out rounded-full border border-gray-300 xl:pl-4 xl:pe-2 xl:justify-between justify-center ${
            isExpanded
              ? "1xl:w-96 xl:w-80 bg-white shadow-md"
              : "w-14 xl:w-40 bg-dashboardBarBackground cursor-pointer"
          }`}
          onClick={handleContainerClick}
        >
          {isExpanded ? (
            <div
              className={`flex items-center w-full transition-opacity duration-300 ease-in-out ${
                showInputContent ? "opacity-100 delay-150" : "opacity-0"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={showInputContent ? placeholder : ""}
                className="flex-grow bg-transparent outline-none text-base pl-2"
              />
              <div className="w-10 h-10 rounded-full bg-gray flex justify-center items-center">
                <Image src={SearchIcon} alt="Search Icon" className="w-5 h-5" />
              </div>
            </div>
          ) : (
            <>
              <p className="text-[17px] hidden xl:block">Search...</p>
              <div className="xl:w-10 xl:h-10 w-11 h-11 rounded-full xl:bg-gray flex justify-center items-center">
                <Image src={SearchIcon} alt="Search Icon" className="w-5 h-5" />
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-20">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4"
            onBlur={handleModalBlur}
          >
            <p className="ms-4 mb-2 text-[17px]">Search</p>
            <div className="flex items-center gap-3 h-14 rounded-full border border-gray-300 px-4">
              <div className="flex items-center w-full">
                <input
                  ref={modalInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-grow bg-transparent outline-none text-base"
                  autoFocus
                />
                <Image
                  src={SearchIcon}
                  alt="Search"
                  className="w-5 h-5 opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
