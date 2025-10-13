import Pagination from "@/app/(dashboards)/components/Pagination"
import { TResource, TResourceResponse } from "@/types/resources";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { getResources } from "@/services/resources/resourceQuery";
import VideoResourceCard from "@/app/(dashboards)/components/VideoResourceCard";
import LetterResourceCard from "@/app/(dashboards)/components/LetterResourceCard";

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
        "PDF",
        on,
        before, after
    );

    if (
        !response.status ||
        !response.data.resources.pdfs ||
        response.data.resources.pdfs.length === 0
    ) {
        return (
            <>
                <NoContent1 />
            </>
        );
    }
    const resources = response.data.resources.pdfs;
    const total = response.data.pagination.pdf.totalPages
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
                    Resource Letters
                </p>
            </div>
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-x-6 gap-y-10">
                {resources.map((resource, index) => (
                    <LetterResourceCard key={index} resource={resource} />
                ))}
            </div>
        </div>

    )
}