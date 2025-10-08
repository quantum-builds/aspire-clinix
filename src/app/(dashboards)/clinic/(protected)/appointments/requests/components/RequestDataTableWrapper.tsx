import { getAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import { TAppointmentRequestResponse } from "@/types/appointment-request";
import { Response } from "@/types/common";

import { RequestsDataTable } from "./RequestDataTable";

// export const revalidate = 0;

interface RequestDataTableWrapperProps {
  query: string;
  page: number;
  status: string;
}

export default async function RequestDataTableWrapper({
  query,
  page,
  status,
}: RequestDataTableWrapperProps) {
  const response: Response<TAppointmentRequestResponse> =
    await getAppointmentRequests({
      search: query,
      page: page,
      status: status,
    });

  if (
    !response.status ||
    !response.data ||
    !response.data.appointmentRequests ||
    response.data.appointmentRequests.length === 0
  ) {
    return (
      <>
        <NoContent1 />
      </>
    );
  }
  const appointmentRequests = response.data.appointmentRequests;
  const total = response.data.pagination.totalPages;

  return (
    <>
      <RequestsDataTable entries={appointmentRequests} />
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
