"use client";

import { TReport } from "@/types/reports";
import LetterReportCard from "./LetterReportCard";
import UploadLetterForm from "../dentist/(protected)/appointments/[id]/reports/new/components/UploadLetterForm";
import PdfModal from "./ViewPdfModal";
import { CalenderInputIconV2, PDFImage, UploadImageSmalIcon } from "@/assets";
import Image from "next/image";
import { X } from "lucide-react";
import { useRef } from "react";

interface LetterReportGridProps {
  reports: TReport[];
  isNewUploadPage?: boolean;
  uploadedPdfs?: File[];
  handlePdfSelect?: (file: File) => void;
  handleRemovePdf?: (index: number) => void;
}

export default function LetterReportGrid({
  reports,
  isNewUploadPage = false,
  uploadedPdfs = [],
  handlePdfSelect,
  handleRemovePdf,
}: LetterReportGridProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && handlePdfSelect) {
      handlePdfSelect(file);
      event.target.value = ""; // reset input for selecting same file again
    }
  };
  return (
    <div className="flex flex-col gap-10">

      <div className="flex justify-between items-center">

        <p className="font-medium text-2xl">
          {isNewUploadPage ? "Upload Letter" : "Letter Reports"}
        </p>
        {isNewUploadPage &&
          <>
            <button
              onClick={handleUploadClick}
              className="px-5 text-base py-2 flex items-center justify-center gap-2 rounded-[100px] disabled:cursor-not-allowed disabled:opacity-75 transition-all bg-gray hover:bg-lightGray w-fit"
            >
              <p>Upload Letter</p>
              <div className="p-4 rounded-full bg-dashboardBarBackground">
                <Image
                  src={UploadImageSmalIcon}
                  alt="button icon"
                  className="w-5 h-5"
                />
              </div>
            </button>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        }
      </div>
      <div className="grid 2xl:grid-cols-5 xl:grid-cols-3 lg:grid-cols-2 gap-x-6 gap-y-10">
        {/* Already saved reports */}
        {reports.map((report, index) => (
          <LetterReportCard key={index} report={report} />
        ))}

        {/* Uploaded but unsaved PDFs */}
        {uploadedPdfs.map((file, index) => {
          const pdfUrl = URL.createObjectURL(file);
          return (
            <div
              key={`uploaded-${index}`}
              className="relative flex flex-col items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-dashboardBackground hover:bg-gray-100 transition"
            >
              {handleRemovePdf && (
                <button
                  onClick={() => handleRemovePdf(index)}
                  className="absolute bg-red-500 rounded-full -top-2 -right-1 text-white p-1 z-20"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              )}

              <div className="relative group w-full flex justify-center">
                <Image src={PDFImage} alt="pdf-image" className="z-0" />

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">
                  <PdfModal
                    pdfUrl={pdfUrl}
                    trigger={
                      <button className="bg-transparent text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-green-700 transition">
                        View
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-1 items-start mt-2">
                <p className="font-medium text-lg truncate w-full">
                  {file.name}
                </p>

                <div className="flex gap-1 items-center">
                  <Image
                    src={CalenderInputIconV2}
                    alt="calendar-icon"
                    className="w-5 h-5"
                  />
                  <p className="text-lg">
                    {new Date().toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Upload form */}
        {/* {isNewUploadPage && handlePdfSelect && (
          <UploadLetterForm onPdfSelect={handlePdfSelect} />
        )} */}
        {uploadedPdfs.length === 0 && isNewUploadPage &&
          <p className="italic text-lg text-nowrap">Please upload the patient's letter reports here.</p>}
      </div>
    </div>
  );
}
