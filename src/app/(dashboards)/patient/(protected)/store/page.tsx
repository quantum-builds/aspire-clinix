// import SearchBar from "@/app/(dashboards)/components/SearchBar";
// import ProductGridWrapper from "./components/ProductGrid";
// import { Suspense } from "react";
// import ProductGridSkeleton from "./components/skeletons/ProductGrid";

// export default async function StorePage(props: {
//   searchParams?: Promise<{
//     query?: string;
//     page?: string;
//   }>;
// }) {
//   // const searchParams = await props.searchParams;
//   // const title = searchParams?.query || "";
//   // const page = Number(searchParams?.page) || 1;

//   return (
//     <div className="min-h-full flex flex-col gap-7 mb-10">
//       <div className="flex items-center justify-between">
//         <h1 className="font-medium text-3xl">Aspire Store</h1>
//         <div>
//           <SearchBar placeholder="Enter Product Name" />
//         </div>
//       </div>
//       <Suspense fallback={<ProductGridSkeleton />}>
//         <ProductGridWrapper props={props} />
//       </Suspense>
//       {/* <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
//           <ProductGridHeader />

//           <Suspense key={title + page} fallback={<ProductGridSkeleton />}>
//             <ProductGridWrapper page={page} title={title} />
//           </Suspense>
//         </div> */}
//     </div>
//   );
// }

import SearchBar from "@/app/(dashboards)/components/SearchBar";
import ProductGridWrapper from "./components/ProductGrid";
import { Suspense } from "react";
import ProductGridSkeleton from "./components/skeletons/ProductGrid";

export default function StorePage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const title = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className=" min-h-full h-full flex flex-col xl:gap-7 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl ">Aspire Store</h1>
        <div>
          <SearchBar placeholder="Enter Product Name" />
        </div>
      </div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGridWrapper page={page} title={title} />
      </Suspense>
    </div>
  );
}
