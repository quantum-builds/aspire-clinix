import { TResource } from "@/types/resources";
import ResourceCard from "./ResourceCard";
import { Response } from "@/types/common";
import NoContent from "@/app/(dashboards)/components/NoContent";
import { TResourceResponse } from "@/types/resources";
import { getResources } from "@/services/resources/resourceQuery";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import Pagination from "@/app/(dashboards)/components/Pagination";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";

interface ResourceGridWrapperProps {
  page: number;
  title: string;
}

interface ResourceGridProps {
  resources: TResource[];
}

export default async function ResourceGridWrapper({
  page,
  title,
}: ResourceGridWrapperProps) {
  const response: Response<TResourceResponse> = await getResources(
    page,
    title,
    "PDF"
  );

  if (
    !response.status ||
    !response.data ||
    !response.data.resources.pdfs ||
    response.data.resources.pdfs.length === 0
  ) {
    // return <NoContent title="Resources" placeholder="Enter Resource title" />;
    return (
      <>
        <NoContent1 />
        <Pagination page={page} isLast={true} />
      </>
    );
  }
  const resources = response.data.resources.pdfs;
  return (
    <>
      <ResourceGrid resources={resources} />
      <Pagination page={page} />
    </>
  );
}

function ResourceGrid({ resources }: ResourceGridProps) {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
      <p className="font-medium text-2xl">Resource Letter</p>
      <div className="grid grid-cols-4 gap-x-6 gap-y-10">
        {resources.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>
    </div>
  );
}
