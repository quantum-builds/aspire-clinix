"use client";
import { TReport } from "@/types/reports";
import { CalenderInputIconV2, VideoImage } from "@/assets";
import Image from "next/image";
import VideoReportCard from "./VideoReportCard";
import { X } from "lucide-react";
import { VideoModal } from "./VideoModal";
import UploadVideoForm from "../dentist/(protected)/appointments/[id]/reports/new/components/UploadVideoForm";

interface VideoReportGridProps {
  reports: TReport[];
  isNewUploadPage?: boolean;
  uploadedVideos?: File[];
  handleVideoSelect?: (file: File) => void;
  handleRemoveVideo?: (index: number) => void;
}

export default function VideoReportGrid({
  reports,
  isNewUploadPage = false,
  uploadedVideos = [],
  handleRemoveVideo,
  handleVideoSelect,
}: VideoReportGridProps) {
  return (
    <div className="flex flex-col gap-10">
      <p className="font-medium text-2xl">
        {isNewUploadPage ? "Upload Video" : "Video Reports"}
      </p>

      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-x-6 gap-y-10">
        {/* Render already saved reports */}
        {reports.map((report, index) => (
          <VideoReportCard key={index} report={report} />
        ))}

        {/* Render uploaded (not yet saved) videos */}
        {uploadedVideos.map((file, index) => {
          const videoUrl = URL.createObjectURL(file);
          return (
            <div
              key={`uploaded-${index}`}
              className="relative flex flex-col items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-dashboardBackground hover:bg-gray-100 transition"
            >
              {handleRemoveVideo && (
                <button
                  onClick={() => handleRemoveVideo(index)}
                  className="absolute bg-red-500 rounded-full -top-2 -right-1 text-white p-1 z-20"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              )}

              <div className="relative group w-full flex justify-center">
                <div className="w-full h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300">
                  <Image
                    src={VideoImage}
                    alt="upload-video"
                    width={110}
                    height={120}
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">
                  <VideoModal
                    video={videoUrl}
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

        {/* Upload new video form */}
        {isNewUploadPage && handleVideoSelect && (
          <UploadVideoForm onVideoSelect={handleVideoSelect} />
        )}
      </div>
    </div>
  );
}
