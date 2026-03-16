import { getAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import { TAppointmentRequest, TAppointmentRequestResponse } from "@/types/appointment-request";
import { AppointmentDateType, Response } from "@/types/common";
import AppointmentRequestCard from "./AppointmendRequestCard";
import { TAppointmentResponse } from "@/types/appointment";
import { getAppointments } from "@/services/appointments/appointmentQuery";
import { Key } from "react";

// export const revalidate = 0;

interface RequestDataTableWrapperProps {
  query: string;
  page: number;
  status: string;
  on: string;
  before: string;
  after: string;
}

export default async function RequestDataTableWrapper({
  query,
  page,
  status,
  on,
  before,
  after,
}: RequestDataTableWrapperProps) {
  const response: Response<TAppointmentResponse> = await getAppointments({
    search: query,
    dateType: AppointmentDateType.PAST,
    page,
    status,
    on,
    before,
    after,
  });

  if (
    !response.status ||
    !response.data ||
    !response.data.appointments ||
    response.data.appointments.length === 0
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
      <div className="flex flex-col gap-4 bg-dashboardBarBackground rounded-2xl py-6 px-6">
        <p className="font-medium text-[22px]">Appointment Requests</p>
        <div className="grid 1xl:grid-cols-2  grid-cols-1 gap-x-4 gap-y-4">
          {appointmentRequests.map((appointment: TAppointmentRequest, index: Key | null | undefined) => (
            <AppointmentRequestCard key={index} request={appointment} />
          ))}
        </div>
      </div>
      {total > 1 && <Pagination page={page} />}
    </>
  );
}
