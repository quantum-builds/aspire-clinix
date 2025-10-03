import { getPractice } from "@/services/practice/practiceQuery";
import { TPractice } from "@/types/practice";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import PracticeDetails from "./PracticeDetails";
import { PracticeDentistDataTable } from "./PracticeDentistsDataTable";
import { PracticeApprovalStatus } from "@prisma/client";

interface PracticeDentistsDataTableWrapperProps {
  id: string;
}

export default async function PracticeDentistsDataTableWrapper({
  id,
}: PracticeDentistsDataTableWrapperProps) {
  const response: Response<TPractice> = await getPractice(id);
  console.log(response.data.dentists);
  if (
    response.status &&
    response.data &&
    (!response.data.dentists ||
      !response.data.dentists ||
      response.data.dentists.length === 0)
  ) {
    return (
      <>
        <PracticeDetails practice={response.data} />
        <PracticeDentistDataTable
          entries={[]}
          practiceId={id}
          status={PracticeApprovalStatus.APPROVED}
        />
      </>
    );
  }

  if (
    !response.status ||
    !response.data ||
    !response.data.dentists ||
    !response.data.dentists ||
    response.data.dentists.length === 0
  ) {
    return <NoContent1 />;
  }

  return (
    <>
      <PracticeDetails practice={response.data} />
      <PracticeDentistDataTable
        entries={response.data.dentists}
        practiceId={id}
        status={PracticeApprovalStatus.APPROVED}
      />
    </>
  );
}
