"use client"
import { CalenderInputIconV2, PDFImage, TimeIconV2 } from "@/assets";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { PdfDownload } from "./PdfDownload";
import PdfModal from "./ViewPdfModal";
import { getFileNameFromUrl } from "@/utils/getFileName";
import { TResource } from "@/types/resources";
import { useDeleteResource } from "@/services/resources/resorurceMutation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { X } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

interface LetterResourceCardProps {
    resource: TResource;
}

export default function LetterResourceCard({ resource }: LetterResourceCardProps) {
    const { mutate: deleteResource, isPending } = useDeleteResource()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { refresh } = useRouter()

    const handleOnDelete = () => {
        deleteResource(
            {
                id: resource.id
            },
            {
                onSuccess: () => {
                    refresh();
                    showToast("success", "Resource deleted successfully");
                    setIsDeleteModalOpen(false)
                },
                onError: (error) => {
                    showToast("error", getAxiosErrorMessage(error));
                    setIsDeleteModalOpen(false)
                },
            }
        );
    }

    return (
        <div className="relative flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground">
            <button
                disabled={isPending}
                onClick={() => setIsDeleteModalOpen(true)}
                className="absolute disabled:cursor-not-allowed bg-red-500 rounded-full -top-2 -right-1 text-white p-1 z-20"
            >
                <X size={18} strokeWidth={2} />
            </button>


            <div className="relative group w-full flex justify-center">
                <div className="w-full h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300">
                    <Image src={PDFImage} alt="upload-video" width={250} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">
                    <PdfModal
                        pdfUrl={resource.file ?? ""}
                        trigger={
                            <button className="bg-transparent text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-lightGray transition">
                                View
                            </button>
                        }
                    />
                    <PdfDownload
                        pdf={resource.file ?? ""}
                        fileName={getFileNameFromUrl(resource.fileUrl)}
                        trigger={
                            <button className="bg-green text-white px-6 py-3 h-[60px] rounded-full border border-white shadow  hover:bg-greenHover transition">
                                Download
                            </button>
                        }
                    />
                </div>
            </div>

            <p className="font-medium text-lg truncate w-full">{resource.title}</p>
            <div className="flex gap-3 items-center justify-start">
                <div className="flex gap-1 items-center">
                    <Image
                        src={CalenderInputIconV2}
                        alt="calender-icon"
                        className="w-5 h-5"
                    />
                    <p className="text-lg">{formatDate(resource.createdAt)}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <Image src={TimeIconV2} alt="time-icon" className="w-5 h-5" />
                    <p className="text-lg">{formatTime(resource.createdAt)}</p>
                </div>
            </div>


            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                isPending={isPending}
                onConfirm={handleOnDelete}
                title="Delete Educational Resource"
                description="Are you sure you want to delete this resource? This action cannot be undone."
                cancelText="No"
                confirmText="Yes"
            />
        </div>
    );
}
