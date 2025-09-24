import { Suspense } from "react";
import Pagination from "@/app/(dashboards)/components/Pagination";
import ResourceGridWrapper from "./components/ResourceGrid";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import { VideoResourceGridSkeleton } from "./components/skeletons/ResourceGrid";

export default async function VideoResourcePage(props: {
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
    <div className="min-h-full flex flex-col gap-7 mb-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Resources</h1>
        <div>
          <SearchBar placeholder="Enter Resource title" />
        </div>
      </div>
      <Suspense key={title + page} fallback={<VideoResourceGridSkeleton />}>
        <ResourceGridWrapper page={page} title={title} />
      </Suspense>
    </div>
  );
}
