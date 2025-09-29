"use client";
import {
  AddToCarIcon,
  FavouriteIcon,
  FavouriteRedIcon,
  StoreImage1,
} from "@/assets";
import { TProduct } from "@/types/products";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEditCartProduct } from "@/services/cartProducts/cartProductMutation";
import Stars from "../../components/Star";

interface ProductCardProps {
  product: TProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavourite, setIsFavourite] = useState<string | null>(null);

  const { refresh } = useRouter();
  const { mutate: addToCart, isPending: isAddToCartPending } =
    useEditCartProduct();

  function handleAddToCart() {
    addToCart(
      {
        productId: product.id,
        quantity: 1,
        patientId: "cmfplxicq0000l6qaof724vtk",
      },
      {
        onSuccess: (data) => {
          console.log("data is ", data);
          // const params = new URLSearchParams(searchParams);
          // params.set("count", String(data.data));
          // replace(`${pathname}?${params.toString()}`);
          refresh();
        },
        onError: (error) => {
          console.log("error is ", error.message);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl p-6 bg-dashboardBackground">
      <div className="relative">
        <Image
          src={product.file ? product.file : StoreImage1}
          alt="store image"
          width={300}
          height={300}
          className="rounded-2xl object-cover w-full"
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
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
        <p className="text-lightBlack w-[60%] line-clamp-1 text-sm">
          {product.name}
        </p>
        <Stars rating={product.ratings} />
      </div>
      <p className="text-xl font-medium capitalize line-clamp-1">
        Aspire {product.name}
      </p>
      <div className="w-full flex justify-between items-center">
        <p className="text-2xl font-semibold  text-green">€ {product.price}</p>
        <p className="text-lightBlack">Only {product.stock} left in-stock</p>
      </div>
    </div>
  );
}
