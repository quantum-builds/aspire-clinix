import { getPractices } from "@/services/practice/practiceQuery";
import CustomButton from "../../components/custom-components/CustomButton";
import PageTopBar from "../../components/custom-components/PageTopBar";
import Pagination from "../../components/Pagination";
import { TPractice } from "@/types/practice";
import { Response } from "@/types/common";
import { PracticeDataTable } from "./components/PracticeDataTable";

export default async function PracticePage(props: {
  searchParams?: Promise<{
    practiceId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams);

  const response: Response<TPractice[]> = await getPractices();
  const practices = response.data;

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
        <PracticeDataTable entries={practices} />
        <Pagination page={1} />
      </div>
    </div>
  );
}
