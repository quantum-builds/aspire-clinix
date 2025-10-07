import { Skeleton } from "@/components/ui/skeleton";

export default function StatusCardSkeleton() {
    return (
        <div className="grid xl:grid-cols-4 grid-cols-2 gap-6 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="min-w-[300px] w-full py-5 px-6 space-y-4 rounded-2xl bg-white"
                >
                    <div className="flex justify-between items-start">
                        <Skeleton className="w-11 h-11 rounded-xl" />
                        <Skeleton className="w-10 h-6" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="w-32 h-6" />
                        <Skeleton className="w-10 h-6" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="w-24 h-5" />
                        <Skeleton className="w-16 h-6" />
                    </div>
                </div>
            ))}
        </div>
    )
}