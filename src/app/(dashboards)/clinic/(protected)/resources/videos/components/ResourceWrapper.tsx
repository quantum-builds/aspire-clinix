import Pagination from "@/app/(dashboards)/components/Pagination"
import { TResource, TResourceResponse } from "@/types/resources";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { getResources } from "@/services/resources/resourceQuery";
import VideoResourceCard from "@/app/(dashboards)/components/VideoResourceCard";

interface ResourceWrapperProps {
    title: string;
    page: number;
    on: string;
    before: string;
    after: string;
}

interface ResourceGridProps {
    resources: TResource[];
}

export default async function ResourceWrapper({
    title,
    page,
    on,
    before,
    after
}: ResourceWrapperProps) {

    const response: Response<TResourceResponse> = await getResources(
        page,
        title,
        "VIDEO",
        on,
        before, after
    );

    if (
        !response.status ||
        !response.data.resources.videos ||
        response.data.resources.videos.length === 0
    ) {
        return (
            <>
                <NoContent1 />
                {/* <Pagination page={page} isLast={true} /> */}
            </>
        );
    }
    const resources = response.data.resources.videos;
    const total = response.data.pagination.video.totalPages
    console.log("total page ", total)

    return (
        <>
            <ResoucrceGrid resources={resources} />
            <Pagination page={page} isLast={page < total ? false : true} />
        </>
    )
}

export function ResoucrceGrid({ resources }: ResourceGridProps) {
    return (
        <div className="px-6 py-5 space-y-5 rounded-2xl bg-white">
            <div className="flex items-center justify-between">
                <p className="font-semibold text-[22px] text-green">
                    Resource Videos
                </p>
            </div>
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-x-6 gap-y-10">
                {resources.map((resource, index) => (
                    <VideoResourceCard key={index} resource={resource} />
                ))}
            </div>
        </div>

    )
}