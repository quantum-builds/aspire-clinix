"use client";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { useCreateReport } from "@/services/reports/reportsMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { TAppointment } from "@/types/appointment";
import { TReport } from "@/types/reports";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { ResoucrceType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { ReportRecipient } from "@/types/reports";
import { useState } from "react";

interface ReportGridProps {
  appointment: TAppointment;
  videoReports?: TReport[];
  pdfReports?: TReport[];
  recipientType?: string; // 'PATIENT' | 'REFERRING_DENTIST'
}

export default function ReportGrid({
  appointment,
  videoReports = [],
  pdfReports = [],
  recipientType,
}: ReportGridProps) {
  const router = useRouter();
  const { mutate: createReport, isPending: createReportLoader } =
    useCreateReport();
  const { mutateAsync: uploadFile, isPending: uploadFileLoader } =
    useUploadFile();

  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const recipientTypeFromParams =
    (searchParams?.get("recipientType") as string) ?? "PATIENT";

  const handlePdfSelect = (file: File) => {
    setUploadedPdfs((prev) => [...prev, file]);
  };

  const handleVideoSelect = (file: File) => {
    setUploadedVideos((prev) => [...prev, file]);
  };

  const handleRemoveVideo = (index: number) => {
    setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemovePdf = (index: number) => {
    setUploadedPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOnSave = async () => {
    try {
      if (uploadedPdfs.length === 0 && uploadedVideos.length === 0) {
        showToast("error", "No files to upload");
        return;
      }
      // Upload PDFs
      const pdfPromises = uploadedPdfs.map(async (file) => {
        const uploaded = await uploadFile({
          selectedFile: file,
          fileType: ResoucrceType.PDF,
        });
        console.log("appointment in report(PDF) is ", appointment);

        return {
          title: file.name,
          fileUrl: `uploads/aspire-clinic/letters/${uploaded.name}`,
          fileType: ResoucrceType.PDF,
          patientDentallyId: String(appointment.patientId),
          appointmentId: String(appointment.id),
          recipientType: recipientTypeFromParams as ReportRecipient,
        };
      });

      // Upload Videos
      const videoPromises = uploadedVideos.map(async (file) => {
        const uploaded = await uploadFile({
          selectedFile: file,
          fileType: ResoucrceType.VIDEO,
        });
        console.log("appointment in report is ", appointment);

        return {
          title: file.name,
          fileUrl: `uploads/aspire-clinic/videos/${uploaded.name}`,
          fileType: ResoucrceType.VIDEO,
          patientDentallyId: String(appointment.patientId),
          appointmentId: String(appointment.id),
          recipientType: recipientTypeFromParams as ReportRecipient,
        };
      });

      const reports = await Promise.all([...pdfPromises, ...videoPromises]);
      console.log("Reports are ", reports);
      createReport(
        { reports },
        {
          onSuccess: () => {
            showToast("success", "Reports uploaded successfully");
            router.replace(
              `/dentist/appointments/${appointment.id}/reports?ts=${Date.now()}`,
            );
          },
          onError: (error) => {
            const msg = getAxiosErrorMessage(error);
            showToast("error", msg);
          },
        },
      );
    } catch (error) {
      console.error("Error in handleOnSave: ", error);
      showToast("error", "Something went wrong while saving reports");
    }
  };

  return (
    <div className="flex flex-col gap-7 bg-dashboardBackground">
      <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6">
        <VideoReportGrid
          reports={videoReports}
          isNewUploadPage={true}
          uploadedVideos={uploadedVideos}
          handleRemoveVideo={handleRemoveVideo}
          handleVideoSelect={handleVideoSelect}
        />
        <LetterReportGrid
          reports={pdfReports}
          isNewUploadPage={true}
          uploadedPdfs={uploadedPdfs}
          handleRemovePdf={handleRemovePdf}
          handlePdfSelect={handlePdfSelect}
        />
      </div>

      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          text="Cancel"
          // disabled={createReportLoader || uploadFileLoader}
          handleOnClick={() => router.back()}
          className="text-[#A3A3A3] h-[60px] w-fit px-6 py-3 bg-gray hover:bg-lightGray shadow-none font-medium text-xl"
        />

        <CustomButton
          text={
            createReportLoader || uploadFileLoader
              ? "Saving Report..."
              : "Save Report"
          }
          handleOnClick={handleOnSave}
          loading={createReportLoader || uploadFileLoader}
          className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-greenHover flex items-center justify-center gap-2 rounded-[100px]"
        />
      </div>
    </div>
  );
}
