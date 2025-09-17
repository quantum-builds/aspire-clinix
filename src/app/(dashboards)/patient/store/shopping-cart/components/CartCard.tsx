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
    <div className="flex gap-10 items-center bg-dashboardBackground rounded-2xl p-6 pr-10">
      <Image
        src={CancelOrderIcon}
        alt="Cancel Icon"
        className="w-5 h-5 cursor-pointer"
        onClick={() => onRemove(cartProduct.id)}
      />

      <Image
        src={StoreImage1}
        alt="store image"
        className="w-[200px] h-[200px] rounded-2xl"
      />

      <div className="flex flex-col gap-4 items-start">
        <p className="text-xl text-lightBlack">Product</p>
        <p className="text-2xl font-medium capitalize">
          aspire {cartProduct.title}
        </p>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <p className="text-xl text-lightBlack">Price</p>
        <p className="text-2xl font-medium capitalize">€ {cartProduct.price}</p>
      </div>

      <div className="flex flex-col gap-4 items-start">
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

      <div className="flex flex-col gap-4 items-start">
        <p className="text-xl text-lightBlack">Total</p>
        <p className="text-2xl font-medium capitalize">€ {cartProduct.total}</p>
      </div>
    </div>
  );
}
