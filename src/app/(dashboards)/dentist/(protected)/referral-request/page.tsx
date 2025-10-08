// import {
//   TReferraLRequestCards,
//   TReferralRequestDataTable,
// } from "@/types/common";
// import NoContent from "@/app/(dashboards)/components/NoContent";
// import { Suspense } from "react";
// import { ReferralRequestDataTable } from "./components/ReferralRequestDataTable";
// import StatsCard from "./components/StatsCard";
// import {
//   TotalReferrals,
//   AttendedReferrals,
//   UnattendedReferrals,
//   AverageReferrals,
// } from "@/assets";
// import Pagination from "@/app/(dashboards)/components/Pagination";
// import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

// const DATA_TABLE_ENTRIES: TReferralRequestDataTable[] = [
//   {
//     id: "1",
//     patientName: "John Doe",
//     referringDentistName: "Dr. Smith",
//     disease: "Cavity",
//     referralDate: "2025-09-17",
//   },
//   {
//     id: "2",
//     patientName: "Jane Roe",
//     referringDentistName: "Dr. Adams",
//     disease: "Gum Infection",
//     referralDate: "2025-09-16",
//   },
//   {
//     id: "3",
//     patientName: "Michael Brown",
//     referringDentistName: "Dr. Lee",
//     disease: "Tooth Decay",
//     referralDate: "2025-09-15",
//   },
//   {
//     id: "4",
//     patientName: "Emily Davis",
//     referringDentistName: "Dr. Johnson",
//     disease: "Wisdom Tooth",
//     referralDate: "2025-09-14",
//   },
//   {
//     id: "5",
//     patientName: "Daniel Wilson",
//     referringDentistName: "Dr. Clark",
//     disease: "Tooth Fracture",
//     referralDate: "2025-09-13",
//   },
//   {
//     id: "6",
//     patientName: "Sophia Martinez",
//     referringDentistName: "Dr. Patel",
//     disease: "Root Canal",
//     referralDate: "2025-09-12",
//   },
// ];

// const REFERRAL_CARDS: TReferraLRequestCards = {
//   totalReferrals: {
//     icon: TotalReferrals,
//     count: 120,
//     percentageChange: 100,
//     title: "Total Referrals",
//     link: "View all referrals",
//   },
//   attendedReferrals: {
//     icon: AttendedReferrals,
//     title: "Attended Referrals",
//     count: 90,
//     percentageChange: 75,
//     link: "View attended",
//   },
//   unattendedReferrals: {
//     icon: UnattendedReferrals,
//     title: "Unattended Referrals",
//     count: 30,
//     link: "View unattended",
//     percentageChange: -25,
//   },
//   averageReferrals: {
//     icon: AverageReferrals,
//     title: "Average Referrals",
//     count: 15,
//     percentageChange: 12.5,
//   },
// };

// export default async function ReferralHistoryPage(props: {
//   searchParams?: Promise<{
//     query?: string;
//   }>;
// }) {
//   const searchParams = await props.searchParams;
//   const query = searchParams?.query || "";

//   const filteredHistory = DATA_TABLE_ENTRIES.filter(
//     (history) =>
//       history.id.toLowerCase().includes(query.toLowerCase()) ||
//       history.patientName.toLowerCase().includes(query.toLowerCase()) ||
//       history.referringDentistName.toLowerCase().includes(query.toLowerCase())
//   );

//   if (filteredHistory.length === 0) {
//     return (
//       <NoContent
//         title="Referral Requests"
//         placeholder="Enter Id or patient/dentist name"
//       />
//     );
//   }

//   return (
//     <div className="w-full min-h-[103vh] flex flex-col gap-5">
//       <PageTopBar
//         pageHeading="Referral Requests"
//         showFilters={true}
//         showSearch={true}
//         statusOptions={[
//           {
//             value: "APPROVED",
//           },
//           {
//             value: "PENDING",
//           },
//           {
//             value: "CANCEL",
//           },
//         ]}
//       />

//       <Suspense key={query} fallback={<div>Loading.....</div>}>
//         <div className="grid 1xl:grid-cols-4 grid-cols-2 gap-4">
//           {Object.entries(REFERRAL_CARDS).map(([key, card]) => (
//             <StatsCard
//               key={key}
//               icon={card.icon}
//               title={card.title}
//               count={card.count}
//               link={card.link}
//               percentageChange={card.percentageChange}
//             />
//           ))}
//         </div>
//         <ReferralRequestDataTable entries={DATA_TABLE_ENTRIES} />
//       </Suspense>
//       <Pagination page={10} />
//     </div>
//   );
// }

import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { ReferralRequestStatus } from "@prisma/client";
import ReferralRequestDataTableWrapper from "./components/ReferralRequestDataTableWrapper";
import StatusCardSkeleton from "@/app/(dashboards)/clinic/(protected)/referrals/components/skeletons/StatusWrapper";
import ReferralDataTableSkeleton from "@/app/(dashboards)/clinic/(protected)/referrals/components/skeletons/ReferralDataTable";
import StatsCardWrapper from "./components/StatsCardWrapper";



export default async function ReferralRequest(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
    ts?: string;
    on?: string;
    before?: string;
    after?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const ts = new Date(searchParams?.ts || "");
  const status = searchParams?.status || "";
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || "";


  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <PageTopBar
        showSearch={true}
        showFilters={true}
        pageHeading="Referral Request"
        statusOptions={[
          {
            value: ReferralRequestStatus.ASSIGNED,
          },
          {
            value: ReferralRequestStatus.UNASSIGNED,
          },
        ]}
      />

      <Suspense fallback={<StatusCardSkeleton />}>
        <StatsCardWrapper />
      </Suspense>
      <Suspense
        key={query + page + status + ts + on + before + after}
        fallback={<ReferralDataTableSkeleton />}
      >
        <ReferralRequestDataTableWrapper query={query} page={page} status={status} on={on} before={before} after={after} />
      </Suspense>
    </div>
  );
}


