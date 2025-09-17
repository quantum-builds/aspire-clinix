import { TProduct } from "@/types/common";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: TProduct[];
}

export default async function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}
