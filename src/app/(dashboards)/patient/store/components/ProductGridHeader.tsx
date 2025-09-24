import Link from "next/link";
import Image from "next/image";
import { CartBagIcon } from "@/assets";
import { getCartProducts } from "@/services/cartProducts/cartProductQuery";
import { Response } from "@/types/common";
import { TCartProduct } from "@/types/products";

export default async function ProductGridHeader() {
  const response: Response<TCartProduct[]> = await getCartProducts(
    "cmfplxicq0000l6qaof724vtk"
  );

  let count = 0;
  if (response.data && response.data.length > 0) {
    count = response.data.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <div className="w-full flex justify-between items-center">
      <p className="font-medium text-2xl ">All Products</p>
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
