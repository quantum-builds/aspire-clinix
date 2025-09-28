import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import { getAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestQuery";
import { TAppointmentRequestResponse } from "@/types/appointment-request";
import { Response } from "@/types/common";
import AppointmentRequestCard from "./AppointmentRequestCard";

interface AppointmentRequestGridProps {
  query: string;
  page: number;
  status: string;
}

export default async function AppointmentRequestGrid({
  query,
  page,
  status,
}: AppointmentRequestGridProps) {
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
        <Pagination page={page} isLast={true} />
      </>
    );
  }

  const appointmentRequests = response.data.appointmentRequests;

  return (
    <div>
      <div className="bg-dashboardBarBackground p-6 rounded-2xl space-y-10">
        <div className="text-2xl font-medium">Appointment Requests</div>
        <div className="grid 1xl50:grid-cols-2 gap-6">
          {appointmentRequests.map((appointmentRequest, index) => (
            <AppointmentRequestCard
              key={index}
              appointmentRequest={appointmentRequest}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
