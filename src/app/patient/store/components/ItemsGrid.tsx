"use client";
import { DropDown4, ShoppingCart } from "@/assets";
import { Item } from "@/types/item";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface ItemGridProps {
  setBagCount: Dispatch<SetStateAction<number>>;
  items: Item[];
}

export default function ItemGrid({ setBagCount, items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="p-2 sm:p-4 md:p-6 flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg sm:text-xl md:text-2xl">
          No items in the store yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {items.map((product, index) => (
          <div
            key={product.id}
            className={`relative flex flex-col ${
              index === 5
                ? "xs:col-span-2 xs:row-span-2"
                : index === 12
                ? "xs:row-span-2"
                : ""
            }`}
          >
            {/* Product image as background */}
            {/* <div
              className="aspect-square relative h-full bg-cover bg-center"
              style={{
                backgroundImage: DropDown4.src, // Use product image as background
              }}
            >
              <button
                className="absolute bottom-2 right-2"
                aria-label="Add to cart"
                onClick={() => setBagCount((prev) => prev + 1)}
              >
                <Image
                  src={ShoppingCart}
                  alt="Shopping Cart"
                  width={24}
                  height={24}
                  className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
                />
              </button>
            </div> */}
            <div
              className="aspect-square relative h-full bg-feeGuide" // Tailwind class for gray background
            >
              <button
                className="absolute bottom-2 right-2"
                aria-label="Add to cart"
                onClick={() => setBagCount((prev) => prev + 1)}
              >
                <Image
                  src={ShoppingCart}
                  alt="Shopping Cart"
                  width={24}
                  height={24}
                  className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
                />
              </button>
            </div>

            {/* Product info */}
            <div className="mt-1 text-xs sm:text-sm">
              <p className="font-medium text-gray-800">{product.title}</p>
              <p className="text-gray-600">£ {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
