import { getAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestQuery";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import { TAppointmentRequestResponse } from "@/types/appointment-request";
import { Response, TAppointmentRequestCards } from "@/types/common";
import StatsCard from "@/app/(dashboards)/dentist/referral-request/components/StatsCard";
import {
  AttendedReferrals,
  AverageReferrals,
  CancelRequestIcon,
  TotalReferrals,
} from "@/assets";
import { RequestsDataTable } from "./RequestDataTable";

const REQUESTS_CARDS: TAppointmentRequestCards = {
  totalRequests: {
    icon: TotalReferrals,
    title: "Total Requests",
    count: 120,
    percentageChange: 100,
    link: "View all requests",
  },
  approvedRequest: {
    icon: AverageReferrals,
    title: "Approved Requests",
    count: 90,
    percentageChange: 75,
    link: "View approved",
  },
  pendingRequests: {
    icon: AttendedReferrals,
    title: "Pending Requests",
    count: 30,
    link: "View pending",
    percentageChange: -25,
  },
  cancelRequests: {
    icon: CancelRequestIcon,
    title: "Cancel Requests",
    count: 15,
    percentageChange: 12.5,
    link: "View cancel",
  },
};

interface RequestDataTableWrapperProps {
  query: string;
  page: number;
}

export default async function RequestDataTableWrapper({
  query,
  page,
}: RequestDataTableWrapperProps) {
  const response: Response<TAppointmentRequestResponse> =
    await getAppointmentRequests({
      search: query,
      patientId: "cmfplxicq0000l6qaof724vtk",
      page: page,
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
    <>
      <div className="grid grid-cols-4 gap-6">
        {Object.entries(REQUESTS_CARDS).map(([key, card]) => (
          <StatsCard
            key={key}
            icon={card.icon}
            title={card.title}
            count={card.count}
            link={card.link}
            percentageChange={card.percentageChange}
          />
        ))}
      </div>
      <RequestsDataTable entries={appointmentRequests} />
      <Pagination page={page} />
    </>
  );
}
