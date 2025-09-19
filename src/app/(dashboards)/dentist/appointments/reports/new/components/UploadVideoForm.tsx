"use client";
import { CalenderInputIcon, UploadVideoIcon } from "@/assets";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

const videoFormSchema = z.object({
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

type FormData = z.infer<typeof videoFormSchema>;

export default function UploadVideoForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: { videoFile: undefined },
  });

  const onSubmit = (data: FormData) => {
    console.log("Video uploaded:", data.videoFile);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground"
    >
      {/* Date */}
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

      {/* File Upload */}
      <Controller
        name="videoFile"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileChange(e, field.onChange)}
            />
            <div
              onClick={handleUploadClick}
              className="w-[402px] h-[240px] flex flex-col items-center justify-center gap-2 rounded-2xl bg-white cursor-pointer"
            >
              <Image src={UploadVideoIcon} alt="upload-video" />
              {field.value && (
                <p className="text-sm text-gray-600 text-center px-2 truncate w-[90%]">
                  {(field.value as File).name}
                </p>
              )}
            </div>
          </div>
        )}
      />
      {errors.videoFile && (
        <p className="text-sm text-red-500">
          {errors.videoFile.message as string}
        </p>
      )}

      {/* Footer Label */}
      <p className="text-center text-green font-medium text-lg">Upload Video</p>
    </form>
  );
}
