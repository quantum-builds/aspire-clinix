import { Skeleton } from "@/components/ui/skeleton";

export default function ChartSkeleton() {
    return (
        <div className="w-full py-5 px-6 space-y-4 rounded-2xl bg-white">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-full h-[260px] rounded-xl" />
        </div>
    )
}
