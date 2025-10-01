"use client";
import LetterReportGrid from "@/app/(dashboards)/components/LetterReportGrid";
import VideoReportGrid from "@/app/(dashboards)/components/VideoReportGrid";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { useCreateReport } from "@/services/reports/requestMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { TAppointment } from "@/types/appointment";
import { showToast } from "@/utils/defaultToastOptions";
import { ResoucrceType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReportGridProps {
  appointment: TAppointment;
}

export default function ReportGrid({ appointment }: ReportGridProps) {
  const router = useRouter();
  const { mutate: createReport, isPending: createReportLoader } =
    useCreateReport();
  const { mutateAsync: uploadFile, isPending: uploadFileLoader } =
    useUploadFile();

  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);

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
        const uploaded = await uploadFile({ selectedFile: file });
        return {
          title: file.name,
          fileUrl: `uploads/aspire-clinic/pdfs/${uploaded.name}`,
          fileType: ResoucrceType.PDF,
          patientId: appointment.patientId,
          appointmentId: appointment.id,
        };
      });

      // Upload Videos
      const videoPromises = uploadedVideos.map(async (file) => {
        const uploaded = await uploadFile({ selectedFile: file });
        return {
          title: file.name,
          fileUrl: `uploads/aspire-clinic/videos/${uploaded.name}`,
          fileType: ResoucrceType.VIDEO,
          patientId: appointment.patientId,
          appointmentId: appointment.id,
        };
      });

      const reports = await Promise.all([...pdfPromises, ...videoPromises]);

      createReport(
        { reports },
        {
          onSuccess: () => {
            showToast("success", "Reports uploaded successfully");
            router.replace(
              `/dentist/appointments/${appointment.id}/reports?ts=${Date.now()}`
            );
          },
          onError: (err) => {
            console.error("Error saving reports: ", err);
            showToast("error", "Failed to save reports");
          },
        }
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
          reports={[]}
          isNewUploadPage={true}
          uploadedVideos={uploadedVideos}
          handleRemoveVideo={handleRemoveVideo}
          handleVideoSelect={handleVideoSelect}
        />
        <LetterReportGrid
          reports={[]}
          isNewUploadPage={true}
          uploadedPdfs={uploadedPdfs}
          handleRemovePdf={handleRemovePdf}
          handlePdfSelect={handlePdfSelect}
        />
      </div>

      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          text="Cancel"
          disabled={createReportLoader || uploadFileLoader}
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
