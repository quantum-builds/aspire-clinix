"use client";

import CartCard from "./CartCard";
import Button from "@/app/(dashboards)/components/Button";
import { TCartProduct } from "@/types/products";
import {
  useBuyProducts,
  useDeleteCartProduct,
  useEditCartProduct,
} from "@/services/cartProducts/cartProductMutation";
import { useState } from "react";
import { TPurchasedProduct } from "@/types/common";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";

interface CartGridProps {
  cartProducts?: TCartProduct[];
}

export default function CartGrid({ cartProducts }: CartGridProps) {
  const { mutate: editCartProduct } = useEditCartProduct();
  const { mutate: deleteCartProduct } = useDeleteCartProduct();
  const { mutate: buyProduct } = useBuyProducts();
  const { refresh } = useRouter();

  const [cart, setCart] = useState<TCartProduct[]>(cartProducts || []);

  let totalPrice = 0;
  if (cart && cart.length > 0) {
    totalPrice = cart.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
  }

  const handleIncrease = (id: string) => {
    const product = cart.find((item) => item.id === id);
    if (!product) return;

    editCartProduct(
      {
        productId: product.product.id,
        quantity: 1,
        patientId: "cmfplxicq0000l6qaof724vtk",
      },
      {
        onSuccess: (res) => {
          // res.data is new quantity from backend
          setCart((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, quantity: res.data } : item
            )
          );
          refresh();
        },
        onError: (error) => {
          console.error("Increase error", error.message);
        },
      }
    );
  };

  const handleDecrease = (id: string) => {
    const product = cart.find((item) => item.id === id);
    if (!product || product.quantity <= 0) return;

    editCartProduct(
      {
        productId: product.product.id,
        quantity: -1,
        patientId: "cmfplxicq0000l6qaof724vtk",
      },
      {
        onSuccess: (res) => {
          setCart((prev) =>
            prev
              .map((item) =>
                item.id === id ? { ...item, quantity: res.data } : item
              )
              .filter((item) => item.quantity > 0)
          );
          refresh();
        },
        onError: (error) => {
          console.error("Decrease error", error.message);
        },
      }
    );
  };

  const handleRemove = (id: string) => {
    const product = cart.find((item) => item.id === id);
    if (!product) return;

    deleteCartProduct(
      {
        productId: product.product.id,
        patientId: "cmfplxicq0000l6qaof724vtk",
      },
      {
        onSuccess: () => {
          setCart((prev) => prev.filter((item) => item.id !== id));
          refresh();
        },
        onError: (error) => {
          console.error("Remove error", error.message);
        },
      }
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("error", "Your cart is empty!");
      return;
    }

    const products: TPurchasedProduct = {
      cartId: cart[0].cartId,
      products: cart.map((cartProduct) => ({
        id: cartProduct.product.id,
        productId: cartProduct.product.productId,
        quantity: cartProduct.quantity,
      })),
    };

    buyProduct(
      { products: products },
      {
        onError: (error) => {
          // toast.error(error.message || "Checkout failed");
          console.log("error is ", error);
        },
        onSuccess: (data) => {
          // toast.success("Redirecting to checkout...");
          // clearCart();
          console.log("data is ", data);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="font-medium text-2xl">Shopping Cart</p>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 flex flex-col gap-6">
          {cart.length > 0 ? (
            cart.map((product) => (
              <CartCard
                key={product.id}
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

        <div className="flex flex-col bg-dashboardBackground justify-between gap-10 rounded-2xl p-6 h-fit">
          <div className="flex flex-col gap-10">
            <p className="text-[28px] font-medium">Cart Totals</p>
            <div className="flex flex-col gap-5">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-2 justify-between text-lightBlack"
                >
                  <span>
                    {product.product.name} x {product.quantity}
                  </span>
                  <span>
                    € {(product.quantity * product.product.price).toFixed(2)}
                  </span>
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
              <Button text="Checkout" handleOnClick={handleCheckout} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
