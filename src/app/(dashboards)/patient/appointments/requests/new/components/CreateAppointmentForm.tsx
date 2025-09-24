"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { CalenderInputIcon, UploadPDFIcon } from "@/assets";
import { cn } from "@/lib/utils";
import { useCreateAppointmentRequests } from "@/services/appointmentRequests/appointmentRequestMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";

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
  const { mutate: createAppointmentRequest } = useCreateAppointmentRequests();
  const { mutateAsync: uploadFile } = useUploadFile();

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

    let fileUrl = "uploads/aspire-clinic/images/placeholder.svg";
    if (data.medicalHistory) {
      const imageUploaded = await uploadFile({
        selectedFile: data.medicalHistory,
      });

      fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    createAppointmentRequest(
      {
        appointmentRequest: {
          patientId: "cmfplxicq0000l6qaof724vtk",
          requestedDate: data.appointmentDate,
          reason: data.appointmentReason,
          note: data.note,
          fileUrl: fileUrl,
        },
      },
      {
        onSuccess: (data: string) => {
          console.log("data from request is ", data);
          reset();
        },
        onError: (error) => {
          console.log("error from request is ", error);
        },
      }
    );
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 space-y-10">
        <div>
          <p className="text-2xl font-medium text-green">Appointment Form</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Appointment Date</Label>
            <Controller
              name="appointmentDate"
              control={control}
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "relative w-full text-left font-normal bg-gray px-6 py-3 h-[52px] rounded-2xl",
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
                        src={CalenderInputIcon}
                        alt="calender-input"
                        className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => date && field.onChange(date)}
                      captionLayout="dropdown"
                      showOutsideDays={false}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.appointmentDate && (
              <p className="text-sm text-red-500">
                {errors.appointmentDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-medium">Appointment Reason</Label>
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

        <div className="space-y-2">
          <Label className="text-lg font-medium">Note</Label>
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

        <div>
          <p className="text-2xl font-medium text-green">Medical History</p>
        </div>

        <div className="space-y-2">
          <Controller
            name="medicalHistory"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-5">
                <div onClick={handleUploadClick} className="cursor-pointer">
                  <input
                    id="fileUpload"
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) =>
                      field.onChange(
                        e.target.files ? e.target.files[0] : undefined
                      )
                    }
                  />
                  <Image src={UploadPDFIcon} alt="upload-pdf" />
                  {field.value && (
                    <p className="text-sm text-gray-600 text-center px-2 truncate w-[90%]">
                      {(field.value as File).name}
                    </p>
                  )}
                </div>

                <Label
                  htmlFor="fileUpload"
                  className="cursor-pointer text-green underline"
                >
                  Upload a Document
                </Label>
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

      <div className="w-full flex justify-end items-center gap-3">
        <Button
          type="button"
          className="text-[#A3A3A3] bg-transparent shadow-none hover:bg-transparent font-medium text-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-green flex items-center justify-center gap-2 rounded-[100px]"
        >
          Book Appointment
        </Button>
      </div>
    </form>
  );
}
