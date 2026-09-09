import { Suspense } from "react";
import ReportGridWrapper from "./components/ReportGridWrapper";
import ReportGridWrapperSkeleton from "./components/skeletons/ReportGridWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { TokenRoles } from "@/constants/UserRoles";
import Button from "@/app/(dashboards)/components/Button";

export default async function ReferralDetailsPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const title = searchParams?.query || "";

  const session = await getServerSession(authOptions);

  const role = session?.user.role;

  return (
    <div className="flex flex-col gap-5 min-h-screen">
      <PageTopBar
        pageHeading="Reports"
        statusOptions={[]}
        showFilters={false}
        showSearch={false}
        showBackBtn={true}
        extraBtns={
          <>
            {role === TokenRoles.ADMIN && (
              <div className="flex justify-end">
                <Button
                  text="Create New Report"
                  href={`/clinic/appointments/${id}/reports/new`}
                  className="w-fit"
                />
              </div>
            )}
          </>
        }
      />
      <Suspense key={id + title} fallback={<ReportGridWrapperSkeleton />}>
        <ReportGridWrapper id={id} title={title} />
      </Suspense>
    </div>
  );
}
