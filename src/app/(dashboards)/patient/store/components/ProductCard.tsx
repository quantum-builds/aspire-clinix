"use client";
import {
  AddToCarIcon,
  FavouriteIcon,
  FavouriteRedIcon,
  StoreImage1,
} from "@/assets";
import { TProduct } from "@/types/common";
import Image from "next/image";
import Stars from "../../components/Star";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ProductCardProps {
  product: TProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavourite, setIsFavourite] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleAddToCart() {
    const params = new URLSearchParams(searchParams);
    const count = Number(params.get("count")) || 0;
    params.set("count", String(count + 1));
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-6 bg-dashboardBackground">
      <div className="relative">
        <Image
          src={StoreImage1}
          alt="store image"
          className="w-[300px] h-[300px] rounded-2xl"
        />
        <button
          className="absolute right-3 top-5 w-11 h-11 rounded-full bg-[#F3F5F7] flex justify-center items-center "
          onClick={() => handleAddToCart()}
        >
          <Image
            src={AddToCarIcon}
            alt="Add To Cart Icon"
            className="w-5 h-5"
          />
        </button>

        <button
          className="absolute right-3 top-20 w-11 h-11 rounded-full bg-[#F3F5F7] flex justify-center items-center"
          onClick={() => {
            isFavourite ? setIsFavourite(null) : setIsFavourite(product.id);
          }}
        >
          {isFavourite === product.id ? (
            <Image
              src={FavouriteRedIcon}
              alt="Favourite Icon"
              className="w-5 h-5"
            />
          ) : (
            <Image
              src={FavouriteIcon}
              alt="Favourite Icon"
              className="w-5 h-5"
            />
          )}
        </button>
      </div>
      <div className="w-full flex justify-between items-center">
        <p className="text-lightBlack">{product.title}</p>
        <Stars rating={product.stars} />
      </div>
      <p className="text-xl font-medium capitalize">Aspire {product.title}</p>
      <div className="w-full flex justify-between items-center">
        <p className="text-[28px] font-semibold text-green">
          € {product.price}
        </p>
        <p className="text-lightBlack">Only {product.stock} left in-stock</p>
      </div>
    </div>
  );
}
