import BackButton from "@/app/(dashboards)/components/BackButton";
import CartGrid from "./components/CartGrid";
import { getCartProducts } from "@/services/cartProducts/cartProductQuery";
import { Response } from "@/types/common";
import { TCartProduct } from "@/types/products";

export default async function ShoppingCartPage() {
  const response: Response<TCartProduct[]> = await getCartProducts(
    "cmfplxicq0000l6qaof724vtk"
  );
  console.log(response.data);
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Aspire Store</h1>
        <div>
          <BackButton />
        </div>
      </div>
      <CartGrid cartProducts={response.data} />
    </div>
  );
}
