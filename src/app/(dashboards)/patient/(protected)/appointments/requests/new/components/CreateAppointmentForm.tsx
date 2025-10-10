"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { CalenderInputIconV2, PreviewPDFIcon, UploadPDFIcon } from "@/assets";
import { cn } from "@/lib/utils";
import { useCreateAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { ResoucrceType } from "@prisma/client";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";
import CustomPopover from "@/app/(dashboards)/components/custom-components/Popover";

const appointmentSchema = z.object({
  appointmentDate: z.date({ required_error: "Appointment date is required" }),
  appointmentReason: z.string().min(2, "Enter appointment reason"),
  note: z.string().optional(),
  medicalHistory: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Please upload a PDF file",
    })
    .refine(
      (file) =>
        !file ||
        (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024),
      { message: "Only PDF files under 5MB are allowed" }
    )
    .optional(),
});

type FormData = z.infer<typeof appointmentSchema>;

export default function AppointmentForm() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: createAppointmentRequest, isPending: createRequestLoader } =
    useCreateAppointmentRequests();
  const { mutateAsync: uploadFile, isPending: uploadFileLoader } =
    useUploadFile();
  const { replace } = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      appointmentDate: new Date(),
      appointmentReason: "",
      note: "",
      medicalHistory: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Appointment Form Submitted:", data);

    let fileUrl = undefined;
    if (data.medicalHistory) {
      const imageUploaded = await uploadFile({
        selectedFile: data.medicalHistory,
        fileType: ResoucrceType.IMAGES,
      });

      fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    createAppointmentRequest(
      {
        appointmentRequest: {
          requestedDate: data.appointmentDate,
          reason: data.appointmentReason,
          note: data.note,
          fileUrl: fileUrl,
        },
      },
      {
        onSuccess: () => {
          reset();
          showToast("success", "Appointment Request Sent");
          replace(`/patient/appointments/requests?ts=${Date.now()}`);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 space-y-6">
        <div>
          <p className="text-[22px] font-semibold text-green">
            Appointment Form
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Date */}
          <div className="space-y-2">
            <Label className="text-[17px]">Appointment Date</Label>
            <Controller
              name="appointmentDate"
              control={control}
              render={({ field }) => (
                <CustomPopover
                  parentClassName="w-full"
                  trigger={
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className={cn(
                        "relative w-full text-left font-normal bg-gray px-6 py-3 h-[52px] rounded-2xl border border-gray-300",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span className="mr-auto">
                          {field.value.toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="mr-auto">Select date</span>
                      )}
                      <Image
                        src={CalenderInputIconV2}
                        alt="calendar-input"
                        className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                      />
                    </button>
                  }
                >
                  <div className="w-full p-3">
                    <div className="border-b border-gray-200 pb-2 mb-3 text-right">
                      <button
                        type="button"
                        className="text-sm hover:text-green"
                        onClick={() => {
                          field.onChange(null);
                          setIsCalendarOpen(false);
                        }}
                      >
                        Clear selection
                      </button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      captionLayout="dropdown"
                      showOutsideDays={false}
                      disabled={{ before: new Date() }}
                    />
                  </div>
                </CustomPopover>
              )}
            />
            {errors.appointmentDate && (
              <p className="text-sm text-red-500">
                {errors.appointmentDate.message}
              </p>
            )}
          </div>

          {/* Appointment Reason */}
          <div className="space-y-2">
            <Label className="text-[17px]">Appointment Reason</Label>
            <Controller
              name="appointmentReason"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter appointment reason"
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                />
              )}
            />
            {errors.appointmentReason && (
              <p className="text-sm text-red-500">
                {errors.appointmentReason.message}
              </p>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label className="text-[17px]">Note</Label>
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Enter note"
                className="border border-green px-6 py-3 h-[200px] rounded-2xl w-full focus:outline-none"
              />
            )}
          />
        </div>

        {/* Medical History */}
        <div className="space-y-2">
          <div>
            <p className="text-[22px] font-semibold text-green">
              Medical History
            </p>
          </div>

          <div className="space-y-2">
            <Controller
              name="medicalHistory"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-5">
                    <div onClick={handleUploadClick} className="cursor-pointer">
                      <input
                        id="fileUpload"
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            field.onChange(file);
                            const objectUrl = URL.createObjectURL(file);
                            setPreviewUrl(objectUrl);
                          }
                        }}
                      />
                      <Image src={UploadPDFIcon} alt="upload-pdf" />
                    </div>

                    <Label
                      htmlFor="fileUpload"
                      className="cursor-pointer text-green underline"
                    >
                      Upload a Document
                    </Label>
                  </div>

                  {field.value && (
                    <PdfModal
                      pdfUrl={previewUrl!}
                      trigger={
                        <p className="text-sm font-medium text-green truncate cursor-pointer flex gap-1 items-center">
                          <Image src={PreviewPDFIcon} alt="Preview pdf icon" />{" "}
                          {(field.value as File).name}
                        </p>
                      }
                    />
                  )}
                </div>
              )}
            />
            {errors.medicalHistory && (
              <p className="text-sm text-red-500">
                {errors.medicalHistory.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          text="Cancel"
          disabled={createRequestLoader || uploadFileLoader}
          handleOnClick={() => reset()}
          className="text-[#A3A3A3] bg-gray  shadow-none hover:bg-lightGray font-medium text-xl"
        />

        <CustomButton
          text={
            createRequestLoader || uploadFileLoader
              ? "Making Request"
              : "Request an Appointment"
          }
          type="submit"
          disabled={createRequestLoader || uploadFileLoader}
          loading={createRequestLoader || uploadFileLoader}
        />
      </div>
    </form>
  );
}
