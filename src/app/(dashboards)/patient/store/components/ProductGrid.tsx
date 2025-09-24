import { TProduct } from "@/types/common";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: TProduct[];
}

export default async function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-4 max-2xl:grid-cols-3 max-[1350px]:grid-cols-2  2xl:gap-x-6 xl:gap-x-4 gap-x-3 gap-y-10">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}
