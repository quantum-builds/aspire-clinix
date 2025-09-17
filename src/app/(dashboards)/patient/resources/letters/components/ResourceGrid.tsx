import { TResource } from "@/types/resources";
import ResourceCard from "./ResourceCard";
import { Response } from "@/types/common";
import NoContent from "@/app/(dashboards)/components/NoContent";
import { TResourceResponse } from "@/types/resources";
import { getResources } from "@/services/resources/resourceQuery";
import SearchBar from "@/app/(dashboards)/components/SearchBar";

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
  const resources = response.data.resources.pdfs;

  if (!resources || resources.length === 0) {
    return <NoContent title="Resources" placeholder="Enter Resource title" />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Resources</h1>
        <div>
          <SearchBar placeholder="Enter Resource title" />
        </div>
      </div>
      <ResourceGrid resources={resources} />;
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
