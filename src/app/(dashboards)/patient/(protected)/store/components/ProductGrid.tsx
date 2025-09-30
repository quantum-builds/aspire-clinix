// import { TProduct } from "@/types/products";
// import ProductCard from "./ProductCard";
// import { Response } from "@/types/common";
// import { TProductResponse } from "@/types/products";
// import { getProducts } from "@/services/products/productQuery";
// import Pagination from "@/app/(dashboards)/components/Pagination";
// import NoContent1 from "@/app/(dashboards)/components/NoContent1";
// import { Suspense } from "react";
// import ProductGridSkeleton from "./skeletons/ProductGrid";
// import ProductGridHeader from "./ProductGridHeader";

// interface ProductGridWrapper {
//   props: {
//     searchParams?:
//       | Promise<{
//           query?: string | undefined;
//           page?: string | undefined;
//         }>
//       | undefined;
//   };
// }
// interface ProductGridProps {
//   products: TProduct[];
// }

// export default async function ProductGridWrapper({
//   props,
// }: ProductGridWrapper) {
//   const searchParams = await props.searchParams;
//   const title = searchParams?.query || "";
//   const page = Number(searchParams?.page) || 1;

//   const response: Response<TProductResponse> = await getProducts(
//     page,
//     title,
//     10
//   );

//   if (
//     !response.data ||
//     !response.data.products ||
//     response.data.products.length === 0
//   ) {
//     return (
//       <>
//         <NoContent1 />
//         <Pagination page={page} isLast={true} />
//       </>
//     );
//   }
//   const products = response.data.products;

//   return (
//     <div className="flex flex-col gap-10 ">
//       <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
//         <ProductGridHeader />

//         {/* <Suspense key={title + page} fallback={<ProductGridSkeleton />}> */}
//         <ProductGrid products={products} />
//         {/* </Suspense> */}
//       </div>
//       <Pagination page={page} />
//     </div>
//   );
// }

// export function ProductGrid({ products }: ProductGridProps) {
//   return (
//     <>
//       <div className="grid grid-cols-4 gap-x-6 gap-y-10">
//         {products.map((product, index) => (
//           <ProductCard key={index} product={product} />
//         ))}
//       </div>
//     </>
//   );
// }

import { TProduct } from "@/types/products";
import ProductCard from "./ProductCard";
import { Response } from "@/types/common";
import { TProductResponse } from "@/types/products";
import { getProducts } from "@/services/products/productQuery";
import Pagination from "@/app/(dashboards)/components/Pagination";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import ProductGridHeader from "./ProductGridHeader";

export default async function ProductGridWrapper({
  page,
  title,
}: {
  page: number;
  title: string;
}) {
  const response: Response<TProductResponse> = await getProducts(
    page,
    title,
    10
  );

  if (!response.data?.products?.length) {
    return (
      <>
        <NoContent1 />
        <Pagination page={page} isLast={true} />
      </>
    );
  }

  const products = response.data.products;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <ProductGridHeader />
        <ProductGrid products={products} />
      </div>
      <Pagination page={page} />
    </div>
  );
}

function ProductGrid({ products }: { products: TProduct[] }) {
  return (
    <div className="grid grid-cols-4 max-2xl:grid-cols-3 max-[1350px]:grid-cols-2  2xl:gap-x-6 xl:gap-x-4 gap-x-3 gap-y-10">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}
