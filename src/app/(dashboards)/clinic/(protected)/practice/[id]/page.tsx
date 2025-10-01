import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { TPractice } from "@/types/practice";
import PracticeDetails from "./components/PracticeDetails";
import { PracticeDentistDataTable } from "./components/PracticeDentistsDataTable";
import {
  DentistRole,
  GenderType,
  PracticeApprovalStatus,
} from "@prisma/client";
import { Suspense } from "react";
import PracticeDentistsDataTableWrapper from "./components/PracticeDentistsDataTableWrapper";
import PracticeDetailsSkeleton from "./components/skeletons/PracticeDetails";
import PracticeDentistDataTableSkeleton from "./components/skeletons/PracticeDentistDataTable";

export default async function PracticePage(props: { params: { id: string } }) {
  const { id } = props.params;

  return (
    <div>
      <div className="min-h-[98vh] flex flex-col gap-5">
        <PageTopBar
          pageHeading="Practices"
          showSearch={false}
          showFilters={false}
          statusOptions={[{ value: PracticeApprovalStatus.APPROVED }]}
          showBackBtn={true}
          extraBtns={
            <CustomButton text="Practice Requests" href={`${id}/requests`} />
          }
        />
        <Suspense
          key={id}
          fallback={
            <>
              <PracticeDetailsSkeleton />
              <PracticeDentistDataTableSkeleton />
            </>
          }
        >
          <PracticeDentistsDataTableWrapper id={id} />
        </Suspense>
      </div>
    </div>
  );
}
