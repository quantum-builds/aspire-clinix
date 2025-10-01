import { getAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import { TAppointmentRequestResponse } from "@/types/appointment-request";
import { Response } from "@/types/common";
import AppointmentRequestCard from "./AppointmendRequestCard";

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
      // <NoContent title="Resources" placeholder="Enter Appointment Number" />
      <>
        <NoContent1 />
        {/* <Pagination page={page} isLast={true} /> */}
      </>
    );
  }

  const appointmentRequests = response.data.appointmentRequests;
  const total = response.data.pagination.totalPages;

  return (
    <>
      <div className="flex flex-col gap-4 bg-dashboardBarBackground rounded-2xl py-6 px-6">
        <p className="font-medium text-[22px]">Appointment Requests</p>
        <div className="grid xl:grid-cols-2  grid-cols-1 gap-x-4 gap-y-4">
          {appointmentRequests.map((appointment, index) => (
            <AppointmentRequestCard key={index} request={appointment} />
          ))}
        </div>
      </div>
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
