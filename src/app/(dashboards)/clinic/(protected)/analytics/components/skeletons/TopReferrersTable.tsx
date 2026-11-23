import { Skeleton } from "@/components/ui/skeleton"

export default function TopReferrersTableSkeleton() {
    return (
        <div className="w-full overflow-x-auto">
            <div className="table-auto border-separate border-spacing-y-3 min-w-max w-full">
                {/* Table Header */}
                <div className="flex bg-dashboardBarBackground rounded-full py-4 px-6 text-xl font-medium text-dashboardTextBlack mb-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex-1 px-4">
                            <Skeleton className="h-6 w-24" />
                        </div>
                    ))}
                </div>

                {/* Table Rows */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center bg-dashboardBackground rounded-full py-4 px-6 mb-3 text-lg"
                    >
                        {Array.from({ length: 8 }).map((_, j) => (
                            <div key={j} className="flex-1 px-4">
                                <Skeleton className="h-6 w-20" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
