"use client"

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { CloseIcon, UploadPDFIcon } from "@/assets";
import PdfModal from "./ViewPdfModal";
import { ReadOnlyCheckbox } from "@/components/ReadOnlyCheckBox";

interface ReferralFormDetailModalProps {
    referralFormDetails: {
        referralDeatils: string;
        treatmentDetails?: string;
        attendTreatment: string;
        medicalHistoryPDF?: string;
    };
}

export default function ReferralFormDetailModal({
    referralFormDetails,
}: ReferralFormDetailModalProps) {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };
    return (
        <>
            <Dialog open={true}>
                <DialogContent
                    className="w-[720px] rounded-2xl p-6 space-y-3 focus:outline-none"
                    onInteractOutside={handleClose}
                >
                    <div className="flex items-center justify-between w-full">
                        <DialogTitle className="font-semibold text-green text-2xl">
                            Referral Form Details
                        </DialogTitle>

                        <div
                            className="size-11 cursor-pointer flex justify-center items-center bg-gray rounded-full"
                            onClick={handleClose}
                        >
                            <Image src={CloseIcon} alt="close" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[22px] font-semibold text-green mb-3">
                            Referral Details
                        </p>
                        <p>{referralFormDetails.referralDeatils}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xl font-semibold text-green mb-3">
                            Description:
                        </p>
                        <p>{referralFormDetails.treatmentDetails ?referralFormDetails.treatmentDetails: <span className="italic">NO Description Added</span>}</p>
                    </div>

                    {referralFormDetails.medicalHistoryPDF && (
                        <PdfModal
                            pdfUrl={referralFormDetails.medicalHistoryPDF}
                            trigger={
                                <div className="flex items-center gap-3 cursor-pointer">
                                    <Image src={UploadPDFIcon} alt="PDF Icon" />
                                    <p className="underline text-green">See Document</p>
                                </div>
                            }
                        />
                    )}

                    <div className="space-y-2">
                        <p className="text- mb-3">
                            Would referral dentist like to attend the treatment appointment with the patient and shadow the dentist?
                        </p>

                        {referralFormDetails.attendTreatment === "yes" ? (
                            <ReadOnlyCheckbox label="Yes" checked={true} />
                        ) : (
                            <ReadOnlyCheckbox label="No" checked={true} />
                        )}
                    </div>

                </DialogContent>
            </Dialog>
        </>
    );
}
