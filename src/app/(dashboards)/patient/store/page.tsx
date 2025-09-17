import { Suspense } from "react";
import NoContent from "../components/NoContent";
import SearchBar from "../components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import { TProduct } from "@/types/common";
import ProductGridHeader from "./components/ProductGridHeader";

const PRODUCTS: TProduct[] = [
  {
    id: "1",
    title: "Electric Toothbrush",
    stars: 4.5,
    fileName: "electric_toothbrush.jpg",
    fileUrl: "https://example.com/products/electric_toothbrush.jpg",
    price: 59.99,
    stock: 120,
  },
  {
    id: "2",
    title: "Whitening Toothpaste",
    stars: 4.2,
    fileName: "whitening_toothpaste.jpg",
    fileUrl: "https://example.com/products/whitening_toothpaste.jpg",
    price: 9.99,
    stock: 500,
  },
  {
    id: "3",
    title: "Dental Floss",
    stars: 4.0,
    fileName: "dental_floss.jpg",
    fileUrl: "https://example.com/products/dental_floss.jpg",
    price: 3.49,
    stock: 800,
  },
  {
    id: "4",
    title: "Mouthwash",
    stars: 4.3,
    fileName: "mouthwash.jpg",
    fileUrl: "https://example.com/products/mouthwash.jpg",
    price: 12.99,
    stock: 350,
  },
  {
    id: "5",
    title: "Orthodontic Wax",
    stars: 4.1,
    fileName: "orthodontic_wax.jpg",
    fileUrl: "https://example.com/products/orthodontic_wax.jpg",
    price: 5.99,
    stock: 200,
  },
  {
    id: "6",
    title: "Kids Toothbrush",
    stars: 4.6,
    fileName: "kids_toothbrush.jpg",
    fileUrl: "https://example.com/products/kids_toothbrush.jpg",
    price: 6.49,
    stock: 300,
  },
  {
    id: "7",
    title: "Interdental Brushes",
    stars: 4.4,
    fileName: "interdental_brushes.jpg",
    fileUrl: "https://example.com/products/interdental_brushes.jpg",
    price: 7.99,
    stock: 150,
  },
  {
    id: "8",
    title: "Tongue Scraper",
    stars: 4.0,
    fileName: "tongue_scraper.jpg",
    fileUrl: "https://example.com/products/tongue_scraper.jpg",
    price: 4.99,
    stock: 400,
  },
  {
    id: "9",
    title: "Water Flosser",
    stars: 4.7,
    fileName: "water_flosser.jpg",
    fileUrl: "https://example.com/products/water_flosser.jpg",
    price: 89.99,
    stock: 100,
  },
  {
    id: "10",
    title: "Dental Mirror",
    stars: 4.2,
    fileName: "dental_mirror.jpg",
    fileUrl: "https://example.com/products/dental_mirror.jpg",
    price: 8.49,
    stock: 250,
  },
];

export default async function ConsentPage(props: {
  searchParams?: Promise<{
    query?: string;
    count?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const title = searchParams?.query || "";
  const count = Number(searchParams?.count) || 0;

  const filteredProducts = PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(title.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return <NoContent title="Prodcuts" placeholder="Enter Product title" />;
  }

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Aspire Store</h1>
        <div>
          <SearchBar placeholder="Enter Product Name" />
        </div>
      </div>
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <Suspense key={count} fallback={<div>Loading....</div>}>
          <ProductGridHeader count={count} />
        </Suspense>
        <Suspense key={title} fallback={<div>Loading.....</div>}>
          <ProductGrid products={filteredProducts} />
        </Suspense>
      </div>
    </div>
  );
}
