import Link from "next/link";
import Image from "next/image";
import { CartBagIcon } from "@/assets";

interface ProductGridHeaderProps {
  count: number;
}
export default function ProductGridHeader({ count }: ProductGridHeaderProps) {
  return (
    <div className="w-full flex justify-between items-center">
      <p className="font-medium text-2xl">All Products</p>
      <div className="flex items-center gap-4">
        <p className="text-lg ">View Cart</p>
        <div className="flex gap-3 items-center bg-dashboardBackground rounded-full p-2 pl-5 ">
          <p className="text-green text-xl font-medium">({count})</p>
          <Link
            href={"/patient/store/shopping-cart"}
            className="w-11 h-11 rounded-full bg-dashboardBarBackground flex justify-center items-center"
          >
            <Image src={CartBagIcon} alt="Cart Bag Icon" className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
