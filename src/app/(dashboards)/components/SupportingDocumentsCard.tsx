"use client";

import Image from "next/image";
import { UploadPDFIcon } from "@/assets";
import PdfModal from "./ViewPdfModal";

interface SupportingDocumentsCardProps {
  medicalHistoryPDF?: string[];
}

function extractFileName(url: string): string {
  try {
    // Remove query parameters first
    const cleanUrl = url.split("?")[0];

    // Get only the filename
    const fileName = cleanUrl.split("/").pop() || cleanUrl;

    // Convert %20, %28, etc. into normal characters
    return decodeURIComponent(fileName);
  } catch {
    return url.split("?")[0].split("/").pop() || url;
  }
}

export default function SupportingDocumentsCard({
  medicalHistoryPDF,
}: SupportingDocumentsCardProps) {
  const documents = medicalHistoryPDF ?? [];

  return (
    <div className="bg-gray p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Image src={UploadPDFIcon} alt="documents" height={24} width={24} />
        <p className="text-green font-medium text-2xl">
          Supporting Documents
        </p>
      </div>

      {documents.length > 0 ? (
        <div className="max-h-64 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((url, index) => (
              <PdfModal
                key={index}
                pdfUrl={url}
                trigger={
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl cursor-pointer">
                    <div className="shrink-0">
                      <Image
                        src={UploadPDFIcon}
                        alt="document"
                        height={20}
                        width={20}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dashboardTextBlack truncate underline">
                        {extractFileName(url)}
                      </p>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No documents uploaded.
        </p>
      )}
    </div>
  );
}