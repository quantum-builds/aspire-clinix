// import ResourceGridWrapper from "./components/ResourceGrid";
// import { LetterReportGridSkeleton } from "./components/skeletons/ResourceGrid";
// import SearchBar from "@/app/(dashboards)/components/SearchBar";
// import { Suspense } from "react";

// export default async function LetterResourcePage(props: {
//   searchParams?: Promise<{
//     dentistId?: string;
//     page?: string;
//     query?: string;
//   }>;
// }) {
//   const searchParams = await props.searchParams;
//   //   const dentistId = searchParams?.dentistId || "";  // will be used when fetching data from frontend
//   const title = searchParams?.query || "";
//   const page = Number(searchParams?.page) || 1;

//   return (
//     <div className="min-h-screen flex flex-col gap-7 mb-10">
//       <div className="flex items-center justify-between">
//         <h1 className="font-medium text-3xl">Resources</h1>
//         <div>
//           <SearchBar placeholder="Enter Resource title" />
//         </div>
//       </div>
//       <Suspense key={title + page} fallback={<LetterReportGridSkeleton />}>
//         <ResourceGridWrapper page={page} title={title} />
//       </Suspense>
//     </div>
//   );
// }

import { VideoResourceGridSkeleton } from "../../../../patient/(protected)/resources/videos/components/skeletons/ResourceGrid";
import { Suspense } from "react";
import PageTopBar from "../../../../components/custom-components/PageTopBar";
import CustomButton from "../../../../components/custom-components/CustomButton";
import { ResoucrceType } from "@prisma/client";
import ResourceWrapper from "@/app/(dashboards)/clinic/(protected)/resources/letters/components/ResourceWrapper";


export default async function Resources(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    on?: string;
    before?: string;
    after?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const title = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || "";

  return (
    <div className="min-h-[103vh] flex flex-col gap-5">
      <PageTopBar
        showFilters={true}
        showSearch={true}
        statusOptions={null}
        pageHeading="Resources"
        searchPlaceHolder="Enter Resource title"
      />

      <Suspense key={title + page} fallback={<VideoResourceGridSkeleton />}>
        <ResourceWrapper
          title={title}
          page={page}
          on={on}
          before={before}
          after={after} />
      </Suspense>
    </div>
  );
}
