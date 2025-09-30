import CustomButton from "../../../components/custom-components/CustomButton";
import PageTopBar from "../../../components/custom-components/PageTopBar";
import { Suspense } from "react";
import PracticeDataTableWrapper from "./components/PracticeDataTableWrapper";
import { PracticeDataTableSkeleton } from "./components/skeletons/PracticeDataTable";

export default async function PracticePage(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
    ts?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const ts = new Date(searchParams?.ts || "");
  const status = searchParams?.status || "";

  return (
    <div>
      <div className="min-h-full flex flex-col gap-5">
        <PageTopBar
          pageHeading="Practices"
          showSearch={true}
          showFilters={true}
          statusOptions={[]}
          extraBtns={
            <CustomButton text="Add New Practice" href="/clinic/practice/new" />
          }
        />
        <Suspense
          key={query + page + ts + status}
          fallback={<PracticeDataTableSkeleton />}
        >
          <PracticeDataTableWrapper query={query} status={status} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
