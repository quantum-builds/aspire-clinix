"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef } from "react";
import { TextIconV2 } from "@/assets";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { TPatientCreate, TPatient } from "@/types/patient";
import { usePatchPatient } from "@/services/patient/patientMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { ResoucrceType } from "@prisma/client";
import { showToast } from "@/utils/defaultToastOptions";
import { useRouter } from "next/navigation";
import { getAMedia } from "@/services/s3/s3Query";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

const profileFormSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  gender: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number",
    )
    .refine(
      (val) => {
        const digitsOnly = val.replace(/\s+/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      { message: "Phone number must be between 10 and 15 digits" },
    )
    .transform((val) => val.replace(/\s+/g, "")),
  gdcNo: z.string().optional(),
  addressLine1: z.string().optional(),
  paymentPlanId: z.string().optional(),
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

type FormData = z.infer<typeof profileFormSchema>;

interface PatientFormProps {
  patient?: TPatient;
}

export default function ProfileForm({ patient }: PatientFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { refresh } = useRouter();

  const { mutate: editPatientInfo, isPending: editPatientInfoLoader } =
    usePatchPatient();
  const { mutateAsync: uploadFile, isPending: uplaodFileLoader } =
    useUploadFile();

  const defaultValues: Partial<FormData> = {
    title: patient?.title ?? "",
    firstName: patient?.firstName ?? "",
    lastName: patient?.lastName ?? "",
    gender: patient?.gender ?? "",
    email: patient?.email ?? "",
    phoneNumber: patient?.mobilePhone ?? "",
    gdcNo: patient?.gdcNo ?? "",
    addressLine1: patient?.addressLine1 ?? "",
    paymentPlanId: patient?.paymentPlanId ?? "",
    dateOfBirth: patient?.dateOfBirth
      ? patient.dateOfBirth.toISOString().split("T")[0]
      : "",
    postCode: patient?.postCode ?? "",
    profileImage: "", // Placeholder or an actual URL (e.g., "https://via.placeholder.com/150")
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageSchema = z
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
          );

        imageSchema.parse(file);

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

  const onSubmit = async (formData: FormData) => {
    console.log("Form submitted:", formData);

    let payload: Record<string, any> = {};

    Object.keys(dirtyFields).forEach((field) => {
      const key = field as keyof FormData;

      if (key === "profileImage" && formData.profileImage instanceof File) {
        return;
      }

      payload[key as keyof TPatientCreate] = formData[key] as any;
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

    editPatientInfo(
      { partialPatient: payload },
      {
        onSuccess: async (data) => {
          showToast("success", "Profile Updated Successfully");

          const file = await getAMedia((data as TPatient).file || "");

          reset(
            {
              title: (data as any).title ?? "",
              firstName: (data as any).firstName ?? "",
              lastName: (data as any).lastName ?? "",
              gender: (data as any).gender ?? "",
              email: data.email ?? (data as any).user?.email ?? "",
              phoneNumber: data.mobilePhone ?? data.mobilePhone ?? "",
              gdcNo: (data as any).gdcNo ?? "",
              paymentPlanId: (data as any).paymentPlanId ?? "",
              addressLine1: (data as any).addressLine1 ?? "",
              dateOfBirth: (data as any).dateOfBirth
                ? new Date((data as any).dateOfBirth)
                    .toISOString()
                    .split("T")[0]
                : "",
              postCode: (data as any).postCode ?? (data as any).postcode ?? "",
              profileImage: file,
            },
            { keepDefaultValues: false },
          );

          refresh();
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      },
    );
  };

  const handleCancel = () => {
    reset(defaultValues);
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
              className="text-green underline cursor-pointer inline-block font-medium"
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
          <div className="space-y-2">
            <div>
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
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="firstName" className="text-lg font-medium">
                First Name<span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="firstName"
                    placeholder="Enter first name"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-lg font-medium">
                Last Name<span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lastName"
                    placeholder="Enter last name"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
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
                    placeholder="Enter email address"
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
            <Label htmlFor="phoneNumber" className="text-lg font-medium">
              Mobile Phone
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
                    placeholder="e.g. +44 7123 456 789"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 mt-4">
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
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
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
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
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
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                />
              )}
            />
            {errors.postCode && (
              <p className="text-sm text-red-500">{errors.postCode.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="gender" className="text-lg font-medium">
              Gender
            </Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="gender"
                  placeholder="male / female"
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="gdcNo" className="text-lg font-medium">
              GDC No
            </Label>
            <Controller
              name="gdcNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="gdcNo"
                  placeholder="GDC Number (if any)"
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="paymentPlanId" className="text-lg font-medium">
              Payment Plan ID
            </Label>
            <Controller
              name="paymentPlanId"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="paymentPlanId"
                  placeholder="Payment plan id"
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          text="Cancel"
          handleOnClick={handleCancel}
          disabled={!isDirty || uplaodFileLoader || editPatientInfoLoader}
          className="text-[#A3A3A3] h-[60px] w-fit px-6 py-3 bg-gray hover:bg-lightGray shadow-none font-medium text-xl"
        />

        <CustomButton
          type="submit"
          text="Save Changes"
          disabled={!isDirty || uplaodFileLoader || editPatientInfoLoader}
          loading={uplaodFileLoader || editPatientInfoLoader}
          className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-greenHover flex items-center justify-center gap-2 rounded-[100px]"
        />
      </div>
    </form>
  );
}
