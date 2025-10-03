import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { PracticeApprovalStatus } from "@prisma/client";
import { Suspense } from "react";
import PracticeDentistsDataTableWrapper from "./components/PracticeDentistDataTableWrapper";
import PracticeDentistDataTableSkeleton from "../components/skeletons/PracticeDentistDataTable";

export default async function PracticePage(props: {
  params: { id: string };
  searchParams?: Promise<{ status?: string }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const status = searchParams?.status || PracticeApprovalStatus.PENDING;

  return (
    <div>
      <div className="min-h-[103vh] flex flex-col gap-5">
        <PageTopBar
          pageHeading="Practice Requests"
          showSearch={false}
          showFilters={true}
          showBackBtn={true}
          showDateFilter={false}
          statusOptions={[
            {
              value: PracticeApprovalStatus.PENDING,
            },
            {
              value: PracticeApprovalStatus.CANCELLED,
            },
          ]}
        />
        {/* 
        {PRACTICE_DATA[0].dentists?.length && (
          <PracticeDentistDataTable entries={PRACTICE_DATA[0].dentists} />
        )}
        <Pagination page={1} /> */}
        <Suspense
          key={status + id}
          fallback={<PracticeDentistDataTableSkeleton />}
        >
          <PracticeDentistsDataTableWrapper status={status} id={id} />
        </Suspense>
      </div>
    </div>
  );
}
