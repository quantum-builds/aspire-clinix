import { TDentistDeatils, TReport } from "@/types/common";
import NoContent from "@/app/(dashboards)/components/NoContent";
import { Suspense } from "react";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import BackButton from "@/app/(dashboards)/components/BackButton";
import ReportGrid from "./component/ReportGrid";

const REPORTS: TReport[] = [
  {
    id: "1",
    title: "Dental Hygiene Report",
    fileUrl: "https://aws.example.com/reports/hygiene.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "2",
    title: "Root Canal Procedure Video",
    fileUrl: "https://aws.example.com/reports/root-canal.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-12"),
  },
  {
    id: "3",
    title: "Orthodontics Progress Report",
    fileUrl: "https://aws.example.com/reports/ortho-progress.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "4",
    title: "Teeth Whitening Session",
    fileUrl: "https://aws.example.com/reports/whitening.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-20"),
  },
  {
    id: "5",
    title: "Annual Dental Checkup",
    fileUrl: "https://aws.example.com/reports/checkup.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-01-25"),
  },
  {
    id: "6",
    title: "Wisdom Tooth Extraction Video",
    fileUrl: "https://aws.example.com/reports/extraction.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-28"),
  },
  {
    id: "7",
    title: "Implant Procedure Report",
    fileUrl: "https://aws.example.com/reports/implant.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-02-01"),
  },
  {
    id: "8",
    title: "Cavity Filling Demonstration",
    fileUrl: "https://aws.example.com/reports/filling.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-02-05"),
  },
  {
    id: "9",
    title: "Pediatric Dentistry Notes",
    fileUrl: "https://aws.example.com/reports/pediatric.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-02-07"),
  },
  {
    id: "10",
    title: "Post Surgery Care Instructions",
    fileUrl: "https://aws.example.com/reports/care-instructions.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-02-10"),
  },
];

const DENTIST_DETAILS: TDentistDeatils = {
  id: "1",
  name: "Dr. Kavin Smith",
  gdcNo: "192 168 209",
  phoneNo: "+971 1121 1189",
  email: "drkavinsmith@gmail.com",
  practiceAddress: "Clinic 208, Street 408, Oslo, Norway",
  date: "2025-09-16",
  time: "09:00",
  appointmentNumber: "APT001",
};

export default async function ReportsPage(props: {
  searchParams?: Promise<{
    dentistId?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  //   const dentistId = searchParams?.dentistId || "";  // will be used when fetching data from frontend
  const title = searchParams?.query || "";

  const filteredReports = REPORTS.filter((report) =>
    report.title.toLowerCase().includes(title.toLowerCase())
  );

  if (filteredReports.length === 0) {
    return <NoContent title="Reports" placeholder="Enter Report title" />;
  }

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Reports</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Report title" />
          <BackButton />
        </div>
      </div>
      <Suspense key={title} fallback={<div>Loading.....</div>}>
        <ReportGrid
          reports={filteredReports}
          dentistDetails={DENTIST_DETAILS}
        />
      </Suspense>
    </div>
  );
}
