import { TReport } from "@/types/common";
import Button from "../../components/Button";
import DateFilter from "../../components/DateFilter";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import VideoReportCard from "../../components/VideoReportCard";

const REPORTS: TReport[] = [
  {
    id: "2",
    title: "Root Canal Procedure Video",
    fileUrl: "https://aws.example.com/reports/root-canal.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-12"),
  },

  {
    id: "4",
    title: "Teeth Whitening Session",
    fileUrl: "https://aws.example.com/reports/whitening.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-20"),
  },

  {
    id: "6",
    title: "Wisdom Tooth Extraction Video",
    fileUrl: "https://aws.example.com/reports/extraction.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-01-28"),
  },

  {
    id: "8",
    title: "Cavity Filling Demonstration",
    fileUrl: "https://aws.example.com/reports/filling.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-02-05"),
  },

  {
    id: "10",
    title: "Post Surgery Care Instructions",
    fileUrl: "https://aws.example.com/reports/care-instructions.mp4",
    fileType: "VIDEO",
    createdAt: new Date("2025-02-10"),
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
