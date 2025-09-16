import { TResource } from "@/types/common";
import NoContent from "../../components/NoContent";
import { Suspense } from "react";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import ResourceGrid from "./components/ResourceGrid";

const RESOURCE: TResource[] = [
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
    fileType: "PDF",
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
    fileType: "PDF",
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
    fileType: "PDF",
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
    fileType: "PDF",
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
    fileType: "PDF",
    createdAt: new Date("2025-02-10"),
  },
];

export default async function VideoResourcePage(props: {
  searchParams?: Promise<{
    dentistId?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  //   const dentistId = searchParams?.dentistId || "";  // will be used when fetching data from frontend
  const title = searchParams?.query || "";

  const filteredResources = RESOURCE.filter((resource) =>
    resource.title.toLowerCase().includes(title.toLowerCase())
  );

  if (filteredResources.length === 0) {
    return <NoContent title="Resources" placeholder="Enter Resource title" />;
  }

  return (
    <div>
      <div className=" w-full h-full flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-3xl">Resources</h1>
          <div>
            <SearchBar placeholder="Enter Resource title" />
          </div>
        </div>
        <Suspense key={title} fallback={<div>Loading.....</div>}>
          <ResourceGrid resources={filteredResources} />
        </Suspense>
      </div>
    </div>
  );
}
