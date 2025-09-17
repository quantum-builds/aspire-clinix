import { TCartProduct } from "@/types/common";
import BackButton from "@/app/(dashboards)/components/BackButton";
import CartGrid from "./components/CartGrid";

const CART: TCartProduct[] = [
  {
    id: "1",
    cartId: "001",
    quantity: 2,
    price: 59.99,
    total: 59.99,
    title: "Electric Toothbrush",
    fileName: "electric_toothbrush.jpg",
    fileUrl: "https://example.com/products/electric_toothbrush.jpg",
  },
  {
    id: "2",
    cartId: "001",
    price: 9.99,
    total: 9.99,
    quantity: 1,
    title: "Whitening Toothpaste",
    fileName: "whitening_toothpaste.jpg",
    fileUrl: "https://example.com/products/whitening_toothpaste.jpg",
  },
];
export default function ShoppingCartPage() {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Aspire Store</h1>
        <div>
          <BackButton />
        </div>
      </div>
      <CartGrid cartProducts={CART} />
    </div>
  );
}
