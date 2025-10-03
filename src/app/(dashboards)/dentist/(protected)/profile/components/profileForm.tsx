"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { TextIconV2 } from "@/assets";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { TDentist, TDentistCreate } from "@/types/dentist";
import { usePatchDentist } from "@/services/dentist/dentistMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { PracticeApprovalStatus, ResoucrceType } from "@prisma/client";
import { showToast } from "@/utils/defaultToastOptions";
import { getAMedia } from "@/services/s3/s3Query";
import { useRouter } from "next/navigation";
import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import { TDentistPractice } from "@/types/dentistRequest";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

// Zod schema for form validation
const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number"
    ),
  gdcNumber: z
    .string()
    .min(4, "GDC number must be at least 4 characters")
    .max(20, "GDC number must be less than 20 characters"),
  practiceAddress: z
    .string()
    .min(5, "Practice address must be at least 5 characters")
    .max(200, "Practice address must be less than 200 characters"),
  profileImage: z.union([
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Image must be less than 5MB"
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          ),
        "Only JPEG, PNG, and WebP images are allowed"
      ),
    z.string().url().or(z.literal("")),
  ]),
});

type FormData = z.infer<typeof profileFormSchema>;

interface DentistFormProps {
  dentist: TDentist;
  request: TDentistPractice;
}

export default function ProfileForm({ dentist, request }: DentistFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: editDentistInfo, isPending: editDentistInfoLoader } =
    usePatchDentist();
  const { mutateAsync: uploadFile, isPending: uplaodFileLoader } =
    useUploadFile();
  const { refresh } = useRouter();

  const practiceAddress = `${request.practice.name}, ${request.practice.addressLine1}, ${request.practice.town}, ${request.practice.postcode}`;
  const practiceEmail = request.practice.email;
  const status = request.status;

  const defaultValues = {
    fullName: dentist?.fullName || "",
    email: dentist?.email || "",
    phoneNumber: dentist?.phoneNumber || "",
    gdcNumber: dentist?.gdcNo || "",
    practiceAddress: practiceAddress || "",
    profileImage: dentist?.file || undefined,
  };

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit = async (formData: FormData) => {
    let payload: Partial<TDentistCreate> = {};

    Object.keys(dirtyFields).forEach((field) => {
      const key = field as keyof FormData;

      if (key === "profileImage" && formData.profileImage instanceof File) {
        payload.fileUrl = "uploads/aspire-clinic/images/placeholder.png";
      } else {
        payload[key as keyof TDentistCreate] = formData[key] as any;
      }
    });

    if (dirtyFields.profileImage && formData.profileImage instanceof File) {
      const imageUploaded = await uploadFile({
        selectedFile: formData.profileImage,
        fileType: ResoucrceType.IMAGES,
      });

      payload.fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    if (Object.keys(payload).length === 0) {
      showToast("info", "No changes to update");
      return;
    }

    editDentistInfo(
      { partialDentist: payload },
      {
        onSuccess: async (data) => {
          showToast("success", "Profile Updated Successfully");
          const file = await getAMedia(data.fileUrl || "");

          reset(
            {
              ...formData,
              profileImage: file,
            },
            { keepDefaultValues: false }
          );

          refresh();
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      }
    );
  };

  const handleCancel = () => {
    reset(defaultValues);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate the image file using Zod
      try {
        const imageSchema = z
          .instanceof(File)
          .refine(
            (file) => file.size <= 5 * 1024 * 1024,
            "Image must be less than 5MB"
          )
          .refine(
            (file) =>
              ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                file.type
              ),
            "Only JPEG, PNG, and WebP images are allowed"
          );

        imageSchema.parse(file);

        // update the form field directly
        setValue("profileImage", file, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch (error) {
        console.error("Image validation failed:", error);
        setValue("profileImage", "", {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  };

  const profileImage = watch("profileImage");

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-dashboardBarBackground rounded-2xl p-6 flex flex-col gap-5">
        <p className="font-semibold text-[22px] text-green">Your Details</p>

        <div className="flex items-center gap-6">
          <div className="bg-gray rounded-2xl h-[120px] w-[120px] overflow-hidden flex items-center justify-center">
            {profileImage ? (
              typeof profileImage === "string" ? (
                <Image
                  src={profileImage}
                  alt="Profile Preview"
                  width={120}
                  height={120}
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile Preview"
                  width={120}
                  height={120}
                  priority
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <span className="text-sm text-gray-500">No Image</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              onClick={handleUploadClick}
              className="text-green underline cursor-pointer inline-block font-medium text-lg"
            >
              Take a picture
            </label>

            {errors.profileImage && (
              <p className="text-sm text-red-500">
                {errors.profileImage.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-lg font-medium">
              Full Name<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="fullName"
                    placeholder="Enter your full name"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextIconV2}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-lg font-medium">
              Email<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextIconV2}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="" className="text-lg font-medium">
              Phone Number<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextIconV2}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="gdcNumber" className="text-lg font-medium">
              GDC No<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="gdcNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="gdcNumber"
                    placeholder="Enter your gdc number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextIconV2}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.gdcNumber && (
              <p className="text-sm text-red-500">{errors.gdcNumber.message}</p>
            )}
          </div>

          <div className="space-y-1 col-span-2">
            <Label htmlFor="practiceAddress" className="text-lg font-medium">
              Practice Address
              <span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="practiceAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="practiceAddress"
                    placeholder="Enter your practice address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                    disabled
                  />
                )}
              />
              <Image
                src={TextIconV2}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
              />
            </div>
            {errors.practiceAddress && (
              <p className="text-sm text-red-500">
                {errors.practiceAddress.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <div className="flex gap-1 items-center">
            Practice Request Status:
            <StatusBage status={status} />
          </div>
          {status === PracticeApprovalStatus.PENDING && (
            <p className="italic font-light">
              For the approval of a practice request, please mail us on{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=aspireclinic@gmail.com&su=Practice%20Request%20Approval"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-green"
              >
                info@aspireclinic.co.uk
              </a>{" "}
              or{" "}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${practiceEmail}&su=Practice%20Request%20Approval`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-green"
              >
                {practiceEmail}
              </a>{" "}
            </p>
          )}
          {status === PracticeApprovalStatus.CANCELLED && (
            <p className="italic font-light">
              ​Your practice request has been cancelled. If you want to request
              again, please mail us on{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=aspireclinic@gmail.com&su=Practice%20Request%20Approval"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-green"
              >
                info@aspireclinic.co.uk
              </a>{" "}
              or{" "}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${practiceEmail}&su=Practice%20Request%20Approval`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-green"
              >
                {practiceEmail}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          text="Cancel"
          handleOnClick={handleCancel}
          disabled={!isDirty || uplaodFileLoader || editDentistInfoLoader}
          className="text-[#A3A3A3] h-[60px] w-fit px-6 py-3 bg-gray hover:bg-lightGray shadow-none font-medium text-xl"
        />

        <CustomButton
          type="submit"
          text="Save Changes"
          disabled={!isDirty || uplaodFileLoader || editDentistInfoLoader}
          loading={uplaodFileLoader || editDentistInfoLoader}
          className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-greenHover flex items-center justify-center gap-2 rounded-[100px]"
        />
      </div>
    </form>
  );
}
