import BackButton from "@/app/(dashboards)/components/BackButton";
import { Suspense } from "react";
import ReportGrid from "../components/ReportGrid";
import NoContent from "@/app/(dashboards)/components/NoContent";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import DateFilter from "@/app/(dashboards)/components/DateFilter";
import { TPatientDetails } from "@/types/common";
import { ResoucrceType } from "@prisma/client";
import { TReport } from "@/types/reports";

const REPORTS: TReport[] = [
  {
    id: "2",
    dentistId: "d2",
    patientId: "p2",
    appointmentId: "a2",
    title: "Root Canal Procedure Video",
    fileUrl: "https://aws.example.com/reports/root-canal.mp4",
    fileType: "VIDEO" as ResoucrceType,
    createdAt: new Date("2025-01-12"),
    updatedAt: new Date("2025-01-13"),
  },
  {
    id: "3",
    dentistId: "d3",
    patientId: "p3",
    appointmentId: "a3",
    title: "Orthodontics Progress Report",
    fileUrl: "https://aws.example.com/reports/ortho-progress.pdf",
    fileType: "PDF" as ResoucrceType,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-16"),
  },
  {
    id: "4",
    dentistId: "d4",
    patientId: "p4",
    appointmentId: "a4",
    title: "Teeth Whitening Session",
    fileUrl: "https://aws.example.com/reports/whitening.mp4",
    fileType: "VIDEO" as ResoucrceType,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-21"),
  },
  {
    id: "5",
    dentistId: "d5",
    patientId: "p5",
    appointmentId: "a5",
    title: "Annual Dental Checkup",
    fileUrl: "https://aws.example.com/reports/checkup.pdf",
    fileType: "PDF" as ResoucrceType,
    createdAt: new Date("2025-01-25"),
    updatedAt: new Date("2025-01-26"),
  },
  {
    id: "6",
    dentistId: "d6",
    patientId: "p6",
    appointmentId: "a6",
    title: "Wisdom Tooth Extraction Video",
    fileUrl: "https://aws.example.com/reports/extraction.mp4",
    fileType: "VIDEO" as ResoucrceType,
    createdAt: new Date("2025-01-28"),
    updatedAt: new Date("2025-01-29"),
  },
  {
    id: "7",
    dentistId: "d7",
    patientId: "p7",
    appointmentId: "a7",
    title: "Implant Procedure Report",
    fileUrl: "https://aws.example.com/reports/implant.pdf",
    fileType: "PDF" as ResoucrceType,
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-02"),
  },
  {
    id: "8",
    dentistId: "d8",
    patientId: "p8",
    appointmentId: "a8",
    title: "Cavity Filling Demonstration",
    fileUrl: "https://aws.example.com/reports/filling.mp4",
    fileType: "VIDEO" as ResoucrceType,
    createdAt: new Date("2025-02-05"),
    updatedAt: new Date("2025-02-06"),
  },
  {
    id: "9",
    dentistId: "d9",
    patientId: "p9",
    appointmentId: "a9",
    title: "Pediatric Dentistry Notes",
    fileUrl: "https://aws.example.com/reports/pediatric.pdf",
    fileType: "PDF" as ResoucrceType,
    createdAt: new Date("2025-02-07"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "10",
    dentistId: "d10",
    patientId: "p10",
    appointmentId: "a10",
    title: "Post Surgery Care Instructions",
    fileUrl: "https://aws.example.com/reports/care-instructions.mp4",
    fileType: "VIDEO" as ResoucrceType,
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-11"),
  },
];

const PATEINT_DETAILS: TPatientDetails = {
  date: "2025-09-16",
  time: "09:00",
  appointmentNumber: "APT001",
  disease: "Toothache",
  patientId: "P001",
  patientName: "Ali Khan",
  patientGender: "Male",
  patientAge: "28",
  patientPhone: "03001234567",
  patientEmail: "alikhan22@example.com",
};

export default async function NewReport(props: {
  searchParams?: Promise<{
    dentistId?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
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
          <DateFilter />
          <BackButton />
        </div>
      </div>
      <Suspense fallback={<div>Loading.....</div>}>
        <ReportGrid
          reports={filteredReports}
          patientDetails={PATEINT_DETAILS}
          isNewUploadPage={true}
        />
      </Suspense>
    </div>
  );
}
