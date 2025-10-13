import { VideoResourceGridSkeleton } from "../../../../patient/(protected)/resources/videos/components/skeletons/ResourceGrid";
import { Suspense } from "react";
import PageTopBar from "../../../../components/custom-components/PageTopBar";
import CustomButton from "../../../../components/custom-components/CustomButton";
import ResourceWrapper from "./components/ResourceWrapper";
import { ResoucrceType } from "@prisma/client";


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
        extraBtns={
          <CustomButton text="Add New Resource" href={`/clinic/resources/new?type=${ResoucrceType.VIDEO}`} />
        }
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
