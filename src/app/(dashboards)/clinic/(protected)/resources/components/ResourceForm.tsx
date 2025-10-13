"use client";
import {
  CalenderInputIconV2,
  PDFImage,
  TextIconV2,
  TimeIconV2,
  UploadImageSmalIcon,
  UploadVideoSmallIcon,
  VideoImage
} from "@/assets";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { useCreateResource } from "@/services/resources/resorurceMutation";
import { useRouter } from "next/navigation";
import { ResoucrceType } from "@prisma/client";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { X } from "lucide-react";
import { VideoModal } from "@/app/(dashboards)/components/VideoModal";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";

interface AddResourceFormProps {
  type?: ResoucrceType;
}

// Base schema for common fields
const baseSchema = {
  resourceTitle: z.string().min(1, "Resource title is required"),
  videoFile: z.instanceof(File).optional(),
};

// Schema factory that validates based on type
const getSchema = (type: ResoucrceType) => {
  if (type === ResoucrceType.VIDEO) {
    return z.object({
      ...baseSchema,
      videoFile: z
        .instanceof(File)
        .refine(
          (file) =>
            file.type.startsWith("video/") && file.size <= 50 * 1024 * 1024,
          { message: "Only video files under 50MB are allowed" }
        ),
    });
  }

  if (type === ResoucrceType.PDF) {
    return z.object({
      ...baseSchema,
      videoFile: z
        .instanceof(File)
        .refine(
          (file) => file.type === "application/pdf" && file.size <= 10 * 1024 * 1024,
          { message: "Only PDF files under 10MB are allowed" }
        ),
    });
  }

  return z.object(baseSchema);
};

export default function AddResourceForm({ type }: AddResourceFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { replace } = useRouter();
  const { mutate: createResource, isPending: createResourceLoader } = useCreateResource();
  const { mutateAsync: uploadFile, isPending: uploadFileLoader } = useUploadFile();

  if (!type) {
    showToast("error", "Invalid resource type");
    return null;
  }

  const resourceFormSchema = getSchema(type);
  type FormData = z.infer<typeof resourceFormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: { resourceTitle: "", videoFile: undefined },
  });

  const onSubmit = async (data: FormData) => {
    if (!data.videoFile) {
      showToast("error", "No file selected to upload");
      return;
    }

    console.log("in component ", type)
    const uploaded = await uploadFile({
      selectedFile: data.videoFile,
      fileType: type,
    });

    let fileUrl;
    if (type === ResoucrceType.VIDEO)
      fileUrl = `uploads/aspire-clinic/videos/${uploaded.name}`;
    else if (type === ResoucrceType.PDF)
      fileUrl = `uploads/aspire-clinic/letters/${uploaded.name}`;

    if (!fileUrl) {
      showToast("error", "Error uploading file");
      return;
    }

    createResource(
      {
        resource: {
          title: data.resourceTitle,
          fileType: type,
          fileUrl,
        },
      },
      {
        onSuccess: () => {
          reset();
          showToast("success", "Resource added successfully");
          replace(
            type === ResoucrceType.VIDEO
              ? `/clinic/resources/videos?ts=${Date.now()}`
              : `/clinic/resources/letters?ts=${Date.now()}`
          );
        },
        onError: (error) => showToast("error", getAxiosErrorMessage(error)),
      }
    );
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setValue("videoFile", file);
    }
  };

  const selectedFile = watch("videoFile");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl px-8 py-8 space-y-5">
        <p className="text-[22px] text-green font-semibold">Add Resource</p>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[17px]">Resource Title</Label>
            <div className="relative">
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
              <Image
                src={TextIconV2}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.resourceTitle && (
              <p className="text-sm text-red-500">{errors.resourceTitle.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Controller
            name="videoFile"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                <div className="flex justify-between items-center">
                  <Label className="text-[22px] font-semibold text-green">
                    Upload {type === ResoucrceType.VIDEO ? "Video" : "PDF"}
                  </Label>

                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={createResourceLoader || uploadFileLoader}
                    className="px-5 text-base py-2 flex items-center justify-center gap-2 rounded-[100px] disabled:cursor-not-allowed disabled:opacity-75 transition-all bg-gray hover:bg-lightGray w-fit"
                  >
                    <p>Upload {type === ResoucrceType.VIDEO ? "Video" : "PDF"}</p>
                    <div className="p-4 rounded-full bg-dashboardBarBackground">
                      <Image
                        src={
                          type === ResoucrceType.VIDEO
                            ? UploadVideoSmallIcon
                            : UploadImageSmalIcon
                        }
                        alt="upload icon"
                        className="w-5 h-5"
                      />
                    </div>
                  </button>

                  <input
                    type="file"
                    accept={type === ResoucrceType.VIDEO ? "video/*" : "application/pdf"}
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, onChange)}
                    className="hidden"
                  />
                </div>

                {selectedFile && (
                  <div className="relative flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground w-full max-w-[472px] mt-4">
                    <button
                      type="button"
                      onClick={() => setValue("videoFile", undefined)}
                      disabled={createResourceLoader || uploadFileLoader}
                      className="absolute bg-red-500 rounded-full -top-2 -right-1 text-white p-1 z-20 disabled:cursor-not-allowed"
                    >
                      <X size={18} strokeWidth={2} />
                    </button>

                    <div className="flex gap-3 items-center justify-end">
                      <div className="flex gap-1 items-center">
                        <Image src={CalenderInputIconV2} alt="calendar-icon" className="w-5 h-5" />
                        <p className="text-lg">{new Date().toLocaleDateString("en-US")}</p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Image src={TimeIconV2} alt="time-icon" className="w-5 h-5" />
                        <p className="text-lg">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {type === ResoucrceType.VIDEO ? (
                      <div className="relative group w-full flex justify-center">
                        <div className="w-full h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300">
                          <Image src={VideoImage} alt="upload-video" width={110} height={120} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">
                          <VideoModal
                            video={URL.createObjectURL(selectedFile)}
                            trigger={
                              <button className="bg-transparent text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-lightGray transition">
                                View
                              </button>
                            }
                          />
                        </div>
                      </div>
                    ) : (

                      <div className="relative group w-full flex justify-center">
                        <div className="w-full h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300">
                          <Image src={PDFImage} alt="upload-video" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">

                          <PdfModal
                            pdfUrl={URL.createObjectURL(selectedFile)}
                            trigger={
                              <button className="bg-transparent text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-lightGray transition">
                                View
                              </button>
                            }
                          />
                        </div>
                      </div>

                    )}
                  </div>
                )}
              </>
            )}
          />

          {errors.videoFile && (
            <p className="text-sm text-red-500">{errors.videoFile.message as string}</p>
          )}
        </div>
      </div>

      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          text="Cancel"
          handleOnClick={() => reset()}
          disabled={createResourceLoader || uploadFileLoader}
          className="text-[#A3A3A3] bg-gray shadow-none hover:bg-lightGray font-medium text-xl"
        />

        <CustomButton
          text="Add Resource"
          type="submit"
          loading={createResourceLoader || uploadFileLoader}
          disabled={createResourceLoader || uploadFileLoader}
          className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-greenHover flex items-center justify-center gap-2 rounded-[100px]"
        />
      </div>
    </form>
  );
}
