"use client";
import { CalenderInputIcon, UploadPDFIcon } from "@/assets";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

const pdfFormSchema = z.object({
  pdfFile: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Please upload a PDF file",
    })
    .refine(
      (file) =>
        !file ||
        (file.type === "application/pdf" && file.size <= 10 * 1024 * 1024), // max 10MB
      { message: "Only PDF files under 10MB are allowed" }
    ),
});

type FormData = z.infer<typeof pdfFormSchema>;

export default function UploadLetterForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(pdfFormSchema),
    defaultValues: { pdfFile: undefined },
  });

  const onSubmit = (data: FormData) => {
    console.log("PDF uploaded:", data.pdfFile);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    onChange(file);
    setValue("pdfFile", file!);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground"
    >
      {/* Date Section */}
      <div className="flex gap-3 items-center justify-end">
        <div className="flex gap-1 items-center">
          <Image
            src={CalenderInputIcon}
            alt="calender-icon"
            className="w-5 h-5"
          />
          <p className="text-lg">{new Date().toLocaleDateString("en-US")}</p>
        </div>
      </div>

      {/* File Upload Section */}
      <Controller
        name="pdfFile"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileChange(e, field.onChange)}
            />
            <div
              onClick={handleUploadClick}
              className="w-[283px] h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white cursor-pointer"
            >
              <Image src={UploadPDFIcon} alt="upload-pdf" />
              {field.value && (
                <p className="mt-2 text-sm text-gray-600 text-center max-w-[250px] truncate">
                  {field.value.name}
                </p>
              )}
            </div>
          </div>
        )}
      />

      {/* Error Message */}
      {errors.pdfFile && (
        <p className="text-sm text-red-500">
          {errors.pdfFile.message as string}
        </p>
      )}

      {/* Label */}
      <p className="text-center text-green font-medium text-lg">Upload PDF</p>
    </form>
  );
}
