import { Suspense } from "react";
import RequestDataTableWrapper from "./components/RequestDataTableWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { RequestDataTableSkeleton } from "./components/skeleton/RequestDataTableSkeleton";
import { AppointmentRequestStatus } from "@prisma/client";
import StatsCard from "@/app/(dashboards)/dentist/referral-request/components/StatsCard";
import {
  AttendedReferrals,
  AverageReferrals,
  CancelRequestIcon,
  TotalReferrals,
} from "@/assets";
import { TAppointmentRequestCards } from "@/types/common";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";

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
    statusParam: AppointmentRequestStatus.APPROVED,
  },
  pendingRequests: {
    icon: AttendedReferrals,
    title: "Pending Requests",
    count: 30,
    link: "View pending",
    percentageChange: -25,
    statusParam: AppointmentRequestStatus.PENDING,
  },
  cancelRequests: {
    icon: CancelRequestIcon,
    title: "Cancel Requests",
    count: 15,
    percentageChange: 12.5,
    link: "View cancel",
    statusParam: AppointmentRequestStatus.CANCEL,
  },
};

export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const status = searchParams?.status || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="min-h-full flex flex-col gap-5 mb-10">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={true}
        showFilters={true}
        extraBtns={
          <CustomButton
            text="Request an appointment"
            href="/patient/appointments/requests/new"
          />
        }
        statusOptions={[
          {
            value: AppointmentRequestStatus.APPROVED,
          },
          {
            value: AppointmentRequestStatus.PENDING,
          },
          {
            value: AppointmentRequestStatus.CANCEL,
          },
        ]}
      />
      <div className="grid grid-cols-4 gap-6">
        {Object.entries(REQUESTS_CARDS).map(([key, card]) => (
          <StatsCard
            key={key}
            icon={card.icon}
            title={card.title}
            count={card.count}
            link={card.link}
            percentageChange={card.percentageChange}
            statusParam={card.statusParam}
          />
        ))}
      </div>
      <Suspense
        key={query + page + status}
        fallback={<RequestDataTableSkeleton />}
      >
        <RequestDataTableWrapper query={query} page={page} status={status} />
      </Suspense>
    </div>
  );
}

