import { TResource } from "@/types/common";
import ResourceCard from "./ResourceCard";

interface ResourceGridProps {
  resources: TResource[];
}

export default function ResourceGrid({ resources }: ResourceGridProps) {
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
