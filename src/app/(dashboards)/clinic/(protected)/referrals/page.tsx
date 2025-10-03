import { Suspense } from "react";

import { ClinicReferralDataTable } from "./components/ClinicReferralDataTable";
import NoContent from "@/app/(dashboards)/components/NoContent";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import DateFilter from "@/app/(dashboards)/components/DateFilter";
import Pagination from "@/app/(dashboards)/components/Pagination";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { ReferralRequestStatus } from "@prisma/client";
import ReferralatDaTableWrapper from "./components/ReferralDataTableWrapper";

// const DATA_TABLE_ENTRIES: TClinicReferralDataTable[] = [
//   {
//     referenceId: "1",
//     patientName: "John Doe",
//     status: "Assigned",
//     disease: "Cavity",
//     referralDate: "2025-09-17",
//     dentistName: "Stone Wave",
//     referralDentistName: "Billy David",
//   },
//   {
//     referenceId: "2",
//     patientName: "Jane Roe",
//     status: "Assigned",
//     disease: "Gum Infection",
//     referralDate: "2025-09-16",
//     dentistName: "Stone Wave",
//     referralDentistName: "Billy David",
//   },
//   {
//     referenceId: "3",
//     patientName: "Michael Brown",
//     status: "Unassigned",
//     disease: "Tooth Decay",
//     referralDate: "2025-09-15",
//     dentistName: "Stone Wave",
//     referralDentistName: "Billy David",
//   },
//   {
//     referenceId: "4",
//     patientName: "Emily Davis",
//     status: "Assigned",
//     disease: "Wisdom Tooth",
//     referralDate: "2025-09-14",
//     dentistName: "Stone Wave",
//     referralDentistName: "Billy David",
//   },
//   {
//     referenceId: "5",
//     patientName: "Daniel Wilson",
//     status: "Unassigned",
//     disease: "Tooth Fracture",
//     referralDate: "2025-09-13",
//     dentistName: "Stone Wave",
//     referralDentistName: "Billy David",
//   },
//   {
//     referenceId: "6",
//     patientName: "Sophia Martinez",
//     status: "Assigned",
//     disease: "Root Canal",
//     referralDate: "2025-09-12",
//     dentistName: "Stone Wave",
//     referralDentistName: "Billy David",
//   },
// ];

export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
    ts?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const ts = new Date(searchParams?.ts || "");
  const status = searchParams?.status || "";

  // const filteredHistory = DATA_TABLE_ENTRIES.filter(
  //   (history) =>
  //     history.referenceId.toLowerCase().includes(query.toLowerCase()) ||
  //     history.patientName.toLowerCase().includes(query.toLowerCase())
  // );

  // if (filteredHistory.length === 0) {
  //   return (
  //     <NoContent
  //       title="Referral History"
  //       placeholder="Enter Id or patient/dentist name"
  //     />
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals"
        showSearch={true}
        showFilters={true}
        statusOptions={[
          {
            value: ReferralRequestStatus.ASSIGNED,
          },
          {
            value: ReferralRequestStatus.UNASSIGNED,
          },
        ]}
      />

      <Suspense
        key={query + page + status + ts}
        fallback={<div>Loading.....</div>}
      >
        <ReferralatDaTableWrapper query={query} page={page} status={status} />
      </Suspense>
    </div>
  );
}
