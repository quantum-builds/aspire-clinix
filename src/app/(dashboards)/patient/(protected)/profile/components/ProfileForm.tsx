"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResoucrceType } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HarryKaneImage, TextIconV2 } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";
import { TPatientCreate, TPatient } from "@/types/patient";
import { usePatchPatient } from "@/services/patient/patientMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

const S3_BASE_URL = "https://aspire-media.s3.eu-west-2.amazonaws.com/";

const profileFormSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  gender: z.string().optional(),
  emailAddress: z.string().email("Please enter a valid email address"),

  mobilePhone: z
    .string()
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number",
    )
    .refine(
      (value) => {
        const digitsOnly = value.replace(/\s+/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      { message: "Phone number must be between 10 and 15 digits" },
    )
    .transform((value) => value.replace(/\s+/g, "")),

  addressLine1: z.string().optional(),
  postCode: z.string().optional(),
  dateOfBirth: z.string().optional(),

  profileImage: z.union([
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Image must be less than 5MB",
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type,
          ),
        "Only JPEG, PNG, and WebP images are allowed",
      ),

    z.string().url().or(z.literal("")),
  ]),
});

type PatientProfileFormValues = z.infer<typeof profileFormSchema>;

interface PatientFormProps {
  patient?: TPatient;
}

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const formatDateForInput = (date?: string | Date | null) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
};

const getAbsoluteImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  return `${S3_BASE_URL}${imageUrl.replace(/^\/+/, "")}`;
};

const getPatientImageUrl = (patient?: TPatient) => {
  if (!patient?.file) return "";

  const imageUrl =
    typeof patient.file === "string" ? patient.file : patient.file?.url || "";

  return getAbsoluteImageUrl(imageUrl);
};

const getPatientFormValues = (
  patient?: TPatient,
): PatientProfileFormValues => ({
  title: patient?.title ?? "",
  firstName: patient?.firstName ?? "",
  lastName: patient?.lastName ?? "",
  gender: patient?.gender ?? "",
  emailAddress: patient?.emailAddress ?? "",
  mobilePhone: patient?.mobilePhone ?? "",
  addressLine1: patient?.addressLine1 ?? "",
  postCode: patient?.postCode ?? "",
  dateOfBirth: formatDateForInput(patient?.dateOfBirth),
  profileImage: getPatientImageUrl(patient),
});

export default function ProfileForm({ patient }: PatientFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { mutateAsync: editPatientInfo, isPending: editPatientInfoLoader } =
    usePatchPatient();

  const { mutateAsync: uploadFile, isPending: uploadFileLoader } =
    useUploadFile();

  const defaultValues = useMemo(
    () => getPatientFormValues(patient),
    [
      patient?.id,
      patient?.title,
      patient?.firstName,
      patient?.lastName,
      patient?.gender,
      patient?.emailAddress,
      patient?.mobilePhone,
      patient?.addressLine1,
      patient?.postCode,
      patient?.dateOfBirth,
      patient?.file,
    ],
  );

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<PatientProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const profileImage = watch("profileImage");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!(profileImage instanceof File)) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(profileImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profileImage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const imageSchema = z
        .instanceof(File)
        .refine(
          (selectedFile) => selectedFile.size <= 5 * 1024 * 1024,
          "Image must be less than 5MB",
        )
        .refine(
          (selectedFile) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              selectedFile.type,
            ),
          "Only JPEG, PNG, and WebP images are allowed",
        );

      imageSchema.parse(file);

      clearErrors("profileImage");

      setValue("profileImage", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof z.ZodError
          ? error.issues[0]?.message
          : "Invalid image selected";

      setError("profileImage", {
        type: "manual",
        message: errorMessage,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onSubmit = async (formData: PatientProfileFormValues) => {
    const payload: Partial<TPatientCreate> = {};

    (Object.keys(dirtyFields) as Array<keyof PatientProfileFormValues>).forEach(
      (field) => {
        if (field === "profileImage") return;

        payload[field as keyof TPatientCreate] = formData[
          field
        ] as never;
      },
    );

    let uploadedImagePath = "";

    try {
      if (dirtyFields.profileImage && formData.profileImage instanceof File) {
        const imageUploaded = await uploadFile({
          selectedFile: formData.profileImage,
          fileType: ResoucrceType.IMAGES,
        });

        uploadedImagePath = `uploads/aspire-clinic/images/${imageUploaded.name}`;
        payload.fileUrl = uploadedImagePath;
      }

      if (Object.keys(payload).length === 0) {
        showToast("info", "No changes to update");
        return;
      }

      const response = await editPatientInfo({
        partialPatient: payload,
      });

      const apiResponse = response as any;
      const apiResult = apiResponse?.data ?? apiResponse;

      if (apiResult?.status === false) {
        throw new Error(apiResult?.message || "Failed to update profile");
      }

      const updatedPatient = apiResult?.data ?? apiResult;

      const savedImageValue =
        updatedPatient?.file?.url ||
        updatedPatient?.fileUrl ||
        uploadedImagePath ||
        (typeof patient?.file === "string"
          ? patient.file
          : patient?.file?.url || "");

      reset({
        title: updatedPatient?.title ?? formData.title,
        firstName: updatedPatient?.firstName ?? formData.firstName,
        lastName: updatedPatient?.lastName ?? formData.lastName,
        gender: updatedPatient?.gender ?? formData.gender,
        emailAddress: updatedPatient?.emailAddress ?? formData.emailAddress,
        mobilePhone: updatedPatient?.mobilePhone ?? formData.mobilePhone,
        addressLine1: updatedPatient?.addressLine1 ?? formData.addressLine1,
        postCode: updatedPatient?.postCode ?? formData.postCode,
        dateOfBirth: updatedPatient?.dateOfBirth
          ? formatDateForInput(updatedPatient.dateOfBirth)
          : formData.dateOfBirth,
        profileImage: getAbsoluteImageUrl(savedImageValue),
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showToast("success", "Profile updated successfully");

      // Only refresh once, after React Hook Form state is reset.
      router.refresh();
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      showToast("error", message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    reset(getPatientFormValues(patient));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isLoading =
    uploadFileLoader || editPatientInfoLoader || isSubmitting;

  const imageSource =
    typeof profileImage === "string" && profileImage
      ? profileImage
      : HarryKaneImage;

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 rounded-2xl bg-dashboardBarBackground p-6">
        <p className="text-[22px] font-semibold text-green">Your Details</p>

        <div className="flex items-center gap-6">
          <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-2xl bg-gray">
            {profileImage instanceof File && previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={imageSource}
                alt="Profile Preview"
                width={120}
                height={120}
                priority
                className="h-full w-full object-cover"
              />
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

            <button
              type="button"
              onClick={handleUploadClick}
              className="inline-block cursor-pointer text-left font-medium text-green underline"
            >
              Take a picture
            </button>

            {errors.profileImage && (
              <p className="text-sm text-red-500">
                {errors.profileImage.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-lg font-medium">
              Title
            </Label>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="e.g. Mr, Ms, Dr"
                  className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-lg font-medium">
              First Name
              <span className="ml-1 text-sm text-red-500">*</span>
            </Label>

            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="firstName"
                  placeholder="Enter first name"
                  className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                />
              )}
            />

            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-lg font-medium">
              Last Name
              <span className="ml-1 text-sm text-red-500">*</span>
            </Label>

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="lastName"
                  placeholder="Enter last name"
                  className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                />
              )}
            />

            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="emailAddress" className="text-lg font-medium">
              Email
              <span className="ml-1 text-sm text-red-500">*</span>
            </Label>

            <div className="relative">
              <Controller
                name="emailAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="emailAddress"
                    type="email"
                    placeholder="Enter email address"
                    className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                  />
                )}
              />

              <Image
                src={TextIconV2}
                alt="text-input"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer"
              />
            </div>

            {errors.emailAddress && (
              <p className="text-sm text-red-500">
                {errors.emailAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="mobilePhone" className="text-lg font-medium">
              Mobile Phone
            </Label>

            <div className="relative">
              <Controller
                name="mobilePhone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="mobilePhone"
                    type="tel"
                    placeholder="e.g. +44 7123 456 789"
                    className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                  />
                )}
              />

              <Image
                src={TextIconV2}
                alt="text-input"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer"
              />
            </div>

            {errors.mobilePhone && (
              <p className="text-sm text-red-500">
                {errors.mobilePhone.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="dateOfBirth" className="text-lg font-medium">
              Date of Birth
            </Label>

            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="dateOfBirth"
                  type="date"
                  className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                />
              )}
            />

            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="addressLine1" className="text-lg font-medium">
              Address Line 1
            </Label>

            <Controller
              name="addressLine1"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="addressLine1"
                  placeholder="Enter address"
                  className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                />
              )}
            />

            {errors.addressLine1 && (
              <p className="text-sm text-red-500">
                {errors.addressLine1.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="postCode" className="text-lg font-medium">
              Postcode
            </Label>

            <Controller
              name="postCode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="postCode"
                  placeholder="Enter postcode"
                  className="h-[52px] rounded-2xl bg-gray px-6 py-3"
                />
              )}
            />

            {errors.postCode && (
              <p className="text-sm text-red-500">{errors.postCode.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-medium">
              Gender
              <span className="text-red-500">*</span>
            </Label>

            <Dropdown
              options={GENDER_OPTIONS}
              value={watch("gender") || ""}
              onValueChange={(value) => {
                setValue("gender", value as "male" | "female", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              placeholder="Select Gender"
              className="w-full rounded-2xl border bg-gray text-base shadow-sm"
              placeholderClassName="text-sm text-muted-foreground"
              triggerClassName="w-full bg-gray px-6 py-3 h-[52px] rounded-2xl text-left"
              contentClassName="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-3">
        <CustomButton
          type="button"
          text="Cancel"
          handleOnClick={handleCancel}
          disabled={!isDirty || isLoading}
          className="h-[60px] w-fit bg-gray px-6 py-3 text-xl font-medium text-[#A3A3A3] shadow-none hover:bg-lightGray"
        />

        <CustomButton
          type="submit"
          text="Save Changes"
          disabled={!isDirty || isLoading}
          loading={isLoading}
          className="flex h-[60px] w-fit items-center justify-center gap-2 rounded-[100px] bg-green px-6 py-3 text-xl font-medium text-dashboardBarBackground hover:bg-greenHover"
        />
      </div>
    </form>
  );
}