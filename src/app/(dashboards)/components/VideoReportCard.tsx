import { CalenderInputIconV2, TimeIconV2, VideoImage } from "@/assets";
import { TReport } from "@/types/reports";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { VideoModal } from "./VideoModal";
import { VideoDownload } from "./VideoDownlaod";
import { getFileNameFromUrl } from "@/utils/getFileName";
import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import { useDeleteReport } from "@/services/reports/reportsMutation";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";

interface VideoReportCardProps {
  report: TReport;
  canDelete?: boolean;
}

export default function VideoReportCard({
  report,
  canDelete = false,
}: VideoReportCardProps) {
  const { mutate: deleteReport, isPending } = useDeleteReport();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { refresh } = useRouter();

  const handleOnDelete = () => {
    deleteReport(
      { id: report.id },
      {
        onSuccess: () => {
          refresh();
          showToast("success", "Report deleted successfully");
          setIsDeleteModalOpen(false);
        },
        onError: (error) => {
          showToast("error", getAxiosErrorMessage(error));
          setIsDeleteModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="relative flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground">
      {canDelete && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => setIsDeleteModalOpen(true)}
          aria-label="Delete report"
          className="absolute disabled:cursor-not-allowed bg-red-500 rounded-full -top-2 -right-1 text-white p-1 z-20"
        >
          <X size={18} strokeWidth={2} />
        </button>
      )}

      <div className="relative group w-full flex justify-center">
        <div className="w-full h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300">
          <Image src={VideoImage} alt="upload-video" width={110} height={120} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">
          <VideoModal
            video={report.file ?? ""}
            trigger={
              <button className="bg-transparent text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-lightGray transition">
                View
              </button>
            }
          />
          <VideoDownload
            video={report.file ?? ""}
            fileName={getFileNameFromUrl(report.fileUrl)}
            text="Download"
          />
        </div>
      </div>

      {canDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          isPending={isPending}
          onConfirm={handleOnDelete}
          title="Delete Report"
          description="Are you sure you want to delete this report? This action cannot be undone."
          cancelText="No"
          confirmText="Yes"
        />
      )}

      <p className="font-medium text-lg truncate w-full">{report.title}</p>
      <div className="flex items-center justify-between w-full">
        <p className="text-20px italic text-greenHover">
          {report.recipientType === "PATIENT" ? "Patient" : "Referring Dentist"}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 items-center">
            <Image
              src={CalenderInputIconV2}
              alt="calender-icon"
              className="w-5 h-5"
            />
            <p className="text-lg">{formatDate(report.createdAt)}</p>
          </div>

          <div className="flex gap-1 items-center">
            <Image src={TimeIconV2} alt="time-icon" className="w-5 h-5" />
            <p className="text-lg">{formatTime(report.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
