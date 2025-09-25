"use client";
import { CalenderInputIcon, TimeIcon, UploadVideoIcon } from "@/assets";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

// ---------------- Schema ----------------
const resourceFormSchema = z.object({
  resourceTitle: z.string().min(1, "Resource title is required"),
  uploadedDate: z.string().min(1, "Uploaded date is required"),
  uploadedTime: z.string().min(1, "Uploaded time is required"),
  videoFile: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Please upload a video file",
    })
    .refine(
      (file) =>
        !file ||
        (file.type.startsWith("video/") && file.size <= 50 * 1024 * 1024),
      { message: "Only video files under 50MB are allowed" }
    ),
});

type FormData = z.infer<typeof resourceFormSchema>;

export default function AddResourceForm() {
  const today = new Date();
  const defaultDate = today.toISOString().split("T")[0];
  const defaultTime = today.toTimeString().slice(0, 5);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultValues = {
    resourceTitle: "",
    uploadedDate: defaultDate,
    uploadedTime: defaultTime,
    videoFile: undefined,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: FormData) => {
    console.log("Resource form submitted:", data);
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
    setValue("videoFile", file!);
  };

  const values = watch();
  useEffect(() => {
    const hasChanges = Object.keys(values).some(
      (key) =>
        values[key as keyof FormData] !== defaultValues[key as keyof FormData]
    );
    setIsDirty(hasChanges);
  }, [values, defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* White Card */}
      <div className="bg-white rounded-2xl p-6 space-y-10">
        <div>
          <p className="text-2xl font-medium">Add Resource</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            {/* Resource Title */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Resource Title</Label>
              <Controller
                name="resourceTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter resource title"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.resourceTitle && (
                <p className="text-sm text-red-500">
                  {errors.resourceTitle.message}
                </p>
              )}
            </div>

            {/* Uploaded Date */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Uploaded Date</Label>
              <div className="relative">
                <Controller
                  name="uploadedDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="bg-gray px-6 py-3 h-[52px] rounded-2xl pr-12 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  )}
                />
                <Image
                  src={CalenderInputIcon}
                  alt="calendar-icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                />
              </div>
              {errors.uploadedDate && (
                <p className="text-sm text-red-500">
                  {errors.uploadedDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg font-medium">Uploaded Time</Label>
              <div className="relative">
                <Controller
                  name="uploadedTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      className="bg-gray px-6 py-3 h-[52px] rounded-2xl pr-12 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  )}
                />
                <Image
                  src={TimeIcon}
                  alt="time-icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                />
              </div>
              {errors.uploadedTime && (
                <p className="text-sm text-red-500">
                  {errors.uploadedTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col">
            <Label className="text-2xl font-medium mb-10">Upload Video</Label>

            <Controller
              name="videoFile"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground w-full max-w-[472px]">
                  {/* Date + Time Row */}
                  <div className="flex gap-3 items-center justify-end">
                    <div className="flex gap-1 items-center">
                      <Image
                        src={CalenderInputIcon}
                        alt="calender-icon"
                        className="w-5 h-5"
                      />
                      <p className="text-lg">
                        {new Date().toLocaleDateString("en-US")}
                      </p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Image
                        src={TimeIcon}
                        alt="time-icon"
                        className="w-5 h-5"
                      />
                      <p className="text-lg">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Upload Box */}
                  <div
                    onClick={handleUploadClick}
                    className="rounded-2xl w-full max-w-[420px] h-[240px] flex flex-col items-center justify-center gap-2 bg-white cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="video/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                    />
                    <Image src={UploadVideoIcon} alt="upload-video" />
                    {field.value && (
                      <p className="text-sm text-gray-600 text-center px-2 truncate w-[90%]">
                        {(field.value as File).name}
                      </p>
                    )}
                  </div>

                  {/* Footer Label */}
                  <p className="text-center text-green font-medium text-lg">
                    Upload Video
                  </p>
                </div>
              )}
            />

            {errors.videoFile && (
              <p className="text-sm text-red-500">
                {errors.videoFile.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons OUTSIDE */}
      {isDirty && (
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
            Add Resource
          </Button>
        </div>
      )}
    </form>
  );
}
