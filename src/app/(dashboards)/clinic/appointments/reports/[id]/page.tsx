import DateFilter from "@/app/(dashboards)/components/DateFilter";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import PatientRDentistDetails from "../components/PatientDentistDetails";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import { TReport } from "@/types/common";
import { ResoucrceType } from "@prisma/client";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ReferralDetailsPage({ params }: PageProps) {
  const patientId = params.id;

  console.log(patientId);

  const patientDetails = {
    name: "Harry Kane",
    gender: "Male",
    phone: "+971 1121 2234",
    email: "harrykane@gmail.com",
    disease: "Tooth Decay",
  };

  const dentistDetails = {
    date: "July 07,2025",
    name: "Harry Kane",
    gdcNo: "192 168 344",
    phone: "+971 1121 2234",
    email: "harrykane@gmail.com",
    address: "Clinic 400, Street 302, Oslo, Norway",
  };

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

  const videoReports = REPORTS.filter(
    (report) => report.fileType !== ResoucrceType.PDF
  );
  const letterReports = REPORTS.filter(
    (report) => report.fileType !== ResoucrceType.PDF
  );

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Reports</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
          <DateFilter />
        </div>
      </div>
      <PatientRDentistDetails
        patientDetials={patientDetails}
        dentistDetails={dentistDetails}
      />
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGrid reports={videoReports} />
        <LetterReportGrid reports={letterReports} />
      </div>
    </div>
  );
}
