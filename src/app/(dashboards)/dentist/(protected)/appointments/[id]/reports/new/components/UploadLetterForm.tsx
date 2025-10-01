"use client";
import {
  CalenderInputIconV2,
  UploadPDFIcon,
} from "@/assets";
import Image from "next/image";
import { useRef } from "react";

interface UploadLetterFormProps {
  onPdfSelect: (file: File) => void;
}

export default function UploadLetterForm({
  onPdfSelect,
}: UploadLetterFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPdfSelect(file); 
      e.target.value = ""; 
    }
  };

  return (
    <div
      onClick={handleUploadClick}
      className="flex flex-col items-center justify-center gap-2 p-8 pt-5 rounded-2xl bg-dashboardBackground cursor-pointer hover:bg-gray-100 transition"
    >
      <div className="flex gap-3 items-center justify-end w-full">
        <div className="flex gap-1 items-center">
          <Image
            src={CalenderInputIconV2}
            alt="calendar-icon"
            className="w-5 h-5"
          />
          <p className="text-lg">{new Date().toLocaleDateString("en-US")}</p>
        </div>
      </div>

      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-[300px] h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300">
        <Image src={UploadPDFIcon} alt="upload-pdf"  width={80} height={100} />
        <p className="mt-2 text-green font-medium text-lg">Upload PDF</p>
      </div>
    </div>
  );
}
