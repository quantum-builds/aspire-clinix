import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import { TAppointmentRequests } from "@/types/common";
import { Suspense } from "react";
import RequestDataTableWrapper from "./components/RequestDataTable";

const DATA_TABLE_ENTRIES: TAppointmentRequests[] = [
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Approved",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Approved",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Cancel",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Pending",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Pending",
    requestDate: new Date("2025-09-17"),
  },
];

export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className=" w-full min-h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointment Requests</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter request no. for appointment requests" />
          <DateFilter />
        </div>
      </div>

      <Suspense key={query + page} fallback={<div>Loading.....</div>}>
        <RequestDataTableWrapper query={query} page={page} />
      </Suspense>
    </div>
  );
}
