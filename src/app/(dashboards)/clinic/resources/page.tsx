import { TReport } from "@/types/reports";
import Button from "../../components/Button";
import DateFilter from "../../components/DateFilter";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import VideoReportCard from "../../components/VideoReportCard";

const REPORTS: TReport[] = [
  {
    id: "1000000000000000000000001",
    dentistId: "d1",
    patientId: "p1",
    appointmentId: "a1",
    title: "Dental Hygiene Report",
    fileUrl: "https://aws.example.com/reports/hygiene.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: "1000000000000000000000002",
    dentistId: "d1",
    patientId: "p1",
    appointmentId: "a2",
    title: "Root Canal Procedure Video",
    fileUrl: "https://aws.example.com/reports/root-canal.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-12"),
    updatedAt: new Date("2025-01-12"),
  },
  {
    id: "1000000000000000000000003",
    dentistId: "d2",
    patientId: "p2",
    appointmentId: "a3",
    title: "Orthodontics Progress Report",
    fileUrl: "https://aws.example.com/reports/ortho-progress.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "1000000000000000000000004",
    dentistId: "d2",
    patientId: "p2",
    appointmentId: "a4",
    title: "Teeth Whitening Session",
    fileUrl: "https://aws.example.com/reports/whitening.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "1000000000000000000000005",
    dentistId: "d3",
    patientId: "p3",
    appointmentId: "a5",
    title: "Annual Dental Checkup",
    fileUrl: "https://aws.example.com/reports/checkup.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-01-25"),
    updatedAt: new Date("2025-01-25"),
  },
  {
    id: "1000000000000000000000006",
    dentistId: "d3",
    patientId: "p3",
    appointmentId: "a6",
    title: "Wisdom Tooth Extraction Video",
    fileUrl: "https://aws.example.com/reports/extraction.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-28"),
    updatedAt: new Date("2025-01-28"),
  },
  {
    id: "1000000000000000000000007",
    dentistId: "d4",
    patientId: "p4",
    appointmentId: "a7",
    title: "Implant Procedure Report",
    fileUrl: "https://aws.example.com/reports/implant.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
  },
  {
    id: "1000000000000000000000008",
    dentistId: "d4",
    patientId: "p4",
    appointmentId: "a8",
    title: "Cavity Filling Demonstration",
    fileUrl: "https://aws.example.com/reports/filling.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-02-05"),
    updatedAt: new Date("2025-02-05"),
  },
  {
    id: "1000000000000000000000009",
    dentistId: "d5",
    patientId: "p5",
    appointmentId: "a9",
    title: "Pediatric Dentistry Notes",
    fileUrl: "https://aws.example.com/reports/pediatric.pdf",
    fileType: "PDF",
    createdAt: new Date("2025-02-07"),
    updatedAt: new Date("2025-02-07"),
  },
  {
    id: "1000000000000000000000010",
    dentistId: "d5",
    patientId: "p5",
    appointmentId: "a10",
    title: "Post Surgery Care Instructions",
    fileUrl: "https://aws.example.com/reports/care-instructions.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-10"),
  },
];
export default async function Resources(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  console.log(query);

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Resources</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
          <DateFilter />
        </div>
      </div>

      <div className="p-6 space-y-10 rounded-2xl bg-white">
        <div className="flex items-center justify-between">
          <p className="font-medium text-2xl">Resource Videos</p>
          <Button text="Add New Resource" href="/clinic/resources/new" />
        </div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-10">
          {REPORTS.map((report, index) => (
            <VideoReportCard key={index} report={report} />
          ))}
        </div>
      </div>

      <Pagination page={10} />
    </div>
  );
}
