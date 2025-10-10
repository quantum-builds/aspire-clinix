import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import { getPractices } from "@/services/practice/practiceQuery";
import { Response } from "@/types/common";
import { TPracticeResponse } from "@/types/practice";
import { PracticeDataTable } from "./PracticeDataTable";

interface PracticeDataTableWrapperProps {
  query: string;
  page: number;
  status: string;
}

export default async function PracticeDataTableWrapper({
  query,
  page,
  status,
}: PracticeDataTableWrapperProps) {
  const response: Response<TPracticeResponse> = await getPractices({
    page: page,
    search: query,
    status: status,
  });

  if (
    !response.status ||
    !response.data ||
    !response.data.practices
  ) {
    return (
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <>
        <NoContent1 />
        {/* <Pagination page={page} isLast={true} /> */}
      </>
    );
  }

  if (response.data.practices.length === 0) {
    return (<NoContent1 text="No Practice registered yet!!!" />)
  }
  
  const practices = response.data.practices;
  const total = response.data.pagination.totalPages;

  return (
    <>
      <PracticeDataTable entries={practices} />
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
