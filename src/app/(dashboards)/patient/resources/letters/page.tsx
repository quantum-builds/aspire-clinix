import { Suspense } from "react";
import Pagination from "@/app/(dashboards)/components/Pagination";
import ResourceGridWrapper from "./components/ResourceGrid";

export default async function LetterResourcePage(props: {
  searchParams?: Promise<{
    dentistId?: string;
    page?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  //   const dentistId = searchParams?.dentistId || "";  // will be used when fetching data from frontend
  const title = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <Suspense key={title + page} fallback={<div>Loading.....</div>}>
        <ResourceGridWrapper page={page} title={title} />
        <Pagination page={page} />
      </Suspense>
    </div>
  );
}
