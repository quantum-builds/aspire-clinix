"use client";

import { useState } from "react";
import { TCartProduct } from "@/types/common";
import CartCard from "./CartCard";
import Button from "@/app/(dashboards)/components/Button";

interface CartGridProps {
  cartProducts: TCartProduct[];
}

export default function CartGrid({ cartProducts }: CartGridProps) {
  const [cart, setCart] = useState<TCartProduct[]>(cartProducts);

  const totalPrice = cart.reduce((acc, product) => acc + product.total, 0);

  const handleIncrease = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price,
            }
          : item
      )
    );
  };

  const handleDecrease = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.quantity > 0
            ? {
                ...item,
                quantity: item.quantity - 1,
                total: (item.quantity - 1) * item.price,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="font-medium text-2xl">Shopping Cart</p>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 flex flex-col gap-6">
          {cart.length > 0 ? (
            cart.map((product, index) => (
              <CartCard
                key={index}
                cartProduct={product}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <p className="text-lg text-lightBlack">Your cart is empty</p>
          )}
        </div>

        <div className="flex flex-col bg-dashboardBackground justify-between rounded-2xl p-6">
          <div className="flex flex-col gap-10">
            <p className="text-[28px] font-medium">Cart Totals</p>
            <div className="flex flex-col gap-5">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-2 justify-between text-lightBlack"
                >
                  <span>{product.title}</span>
                  <span>€ {product.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <span className="font-medium text-2xl">Total</span>
                <span className="font-medium text-2xl">
                  € {totalPrice.toFixed(2)}
                </span>
              </div>
              <Button text="Checkout" href={"/patient/store"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
