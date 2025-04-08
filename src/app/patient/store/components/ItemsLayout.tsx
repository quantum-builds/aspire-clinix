"use client";
import { ShoppingBag } from "@/assets";
import { useState } from "react";
import ItemGrid from "@/app/patient/store/components/ItemsGrid";
import Image from "next/image";
import { Item } from "@/types/item";
// import { Item, ItemType } from "@/types/item";

interface ItemLayoutProps {
  items: Item[];
}

enum ItemType {
  ALL = "ALL",
  TOOTH_CARE = "TOOTH_CARE",
  GUM_CARE = "GUM_CARE",
}

export default function ItemLayout({ items }: ItemLayoutProps) {
  console.log(items);
  const [bagCount, setBagCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ItemType>(ItemType.ALL);

  // Filter items based on the selected filter
  const filteredItems = items.filter((item) => {
    if (selectedFilter === "ALL") return true; // Show all items
    return item.type === selectedFilter; // Filter by type
  });

  return (
    <>
      <div className=" flex-1 p-8 md:p-10 lg:px-[7%] lg:py-[9%] flex flex-col gap-11 bg-feeguidedark">
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-normal mb-3 font-opus">
          Store
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          {/* Mobile filter toggle */}
          <button
            className="flex items-center gap-2 sm:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className="font-light text-lg font-gillSans">
              {isFilterOpen ? "Close Filter" : "Filter"}
            </span>
          </button>

          {/* Desktop navigation */}
          <div
            className={`${
              isFilterOpen ? "flex" : "hidden"
            } sm:flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-20 lg:gap-36 w-full sm:w-auto`}
          >
            <p
              className="font-light text-xl font-gillSans cursor-pointer"
              onClick={() => setSelectedFilter(ItemType.ALL)} // Show all items
            >
              Shop all
            </p>
            <div className="flex flex-col gap-4 sm:gap-8">
              <p className="font-light text-xl font-gillSans cursor-pointer">
                Filter
              </p>
              <div className="flex flex-col gap-1">
                <p
                  className="font-gillSans cursor-pointer"
                  onClick={() => setSelectedFilter(ItemType.TOOTH_CARE)} // Filter by Tooth Care
                >
                  Tooth Care
                </p>
                <div className="bg-black h-px w-full"></div>
                <p
                  className="font-gillSans cursor-pointer"
                  onClick={() => setSelectedFilter(ItemType.GUM_CARE)} // Filter by Gum Care
                >
                  Gum Care
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 ml-auto sm:ml-0">
            <Image
              src={ShoppingBag}
              alt="Shopping Bag"
              width={45}
              height={45}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-auto lg:h-auto"
            />
            <p className="font-gillSans text-lg sm:text-xl md:text-2xl">{`( ${bagCount} )`}</p>
          </div>
        </div>

        {/* Pass filtered items to ItemGrid */}
        <ItemGrid items={filteredItems} setBagCount={setBagCount} />
      </div>
    </>
  );
}
