import { CancelOrderIcon, MinusIcon, PlusIcon, StoreImage1 } from "@/assets";
import { TCartProduct } from "@/types/common";
import Image from "next/image";

interface CartCardProps {
  cartProduct: TCartProduct;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CartCard({
  cartProduct,
  onIncrease,
  onDecrease,
  onRemove,
}: CartCardProps) {
  return (
    <div className="flex gap-8 max-2xl:gap-6 justify-between items-center bg-dashboardBackground rounded-2xl p-6">
      <Image
        src={CancelOrderIcon}
        alt="Cancel Icon"
        className="w-5 h-5 cursor-pointer"
        onClick={() => onRemove(cartProduct.id)}
      />

      <div className="">
        <Image
          src={StoreImage1}
          alt="store image"
          className="w-[180px] h-[180px] rounded-2xl"
        />
      </div>

      <div className="flex-1 flex gap-6 max-2xl:flex-col">
        <div className="flex-1">
          <div className="flex flex-col  2xl:gap-4 items-start">
            <p className="text-xl text-lightBlack">Product</p>
            <p className="text-2xl font-medium capitalize line-clamp-1">
              aspire {cartProduct.title}
            </p>
          </div>
        </div>

        <div className="flex justify-between flex-1">
          <div className="flex flex-col 2xl:gap-4 items-start">
            <p className="text-xl text-lightBlack">Price</p>
            <p className="text-2xl font-medium capitalize">
              € {cartProduct.price}
            </p>
          </div>

          <div className="flex flex-col 2xl:gap-4 items-start">
            <p className="text-xl text-lightBlack">Quantity</p>
            <div className="flex items-center gap-3">
              <Image
                src={MinusIcon}
                alt="Minus Icon"
                className="w-5 h-5 cursor-pointer"
                onClick={() => onDecrease(cartProduct.id)}
              />
              <p className="text-2xl font-medium capitalize">
                {cartProduct.quantity}
              </p>
              <Image
                src={PlusIcon}
                alt="Plus Icon"
                className="w-5 h-5 cursor-pointer"
                onClick={() => onIncrease(cartProduct.id)}
              />
            </div>
          </div>

          <div className="flex flex-col 2xl:gap-4 items-start">
            <p className="text-xl text-lightBlack">Total</p>
            <p className="text-2xl font-medium capitalize">
              € {cartProduct.total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
