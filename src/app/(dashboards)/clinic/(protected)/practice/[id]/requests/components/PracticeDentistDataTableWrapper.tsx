import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { getDentistPractice } from "@/services/dentistOnPractice/dentistOnPracticeQuery";
import { TDentistPractice } from "@/types/dentistRequest";
import { PracticeDentistDataTable } from "../../components/PracticeDentistsDataTable";

interface PracticeDentistsDataTableWrapperProps {
  id: string;
  status: string;
}

export default async function PracticeDentistsDataTableWrapper({
  id,
  status,
}: PracticeDentistsDataTableWrapperProps) {
  const response: Response<TDentistPractice[]> = await getDentistPractice({
    practiceId: id,
    status,
  });

  if (!response.status || !response.data || response.data.length === 0) {
    return <NoContent1 />;
  }
  return (
    <>
      <PracticeDentistDataTable entries={response.data} practiceId={id}  status={status}/>
    </>
  );
}
