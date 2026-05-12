"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef } from "react";
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

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  gdcNumber: z
    .string()
    .min(4, "GDC number must be at least 4 characters")
    .max(20, "GDC number must be less than 20 characters"),
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

interface DentistFormProps {
  dentist: TDentist;
  request: TDentistPractice | null;
}

export default function ProfileForm({ dentist, request }: DentistFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: editDentistInfo, isPending: editDentistInfoLoader } =
    usePatchDentist();
  const { mutateAsync: uploadFile, isPending: uplaodFileLoader } =
    useUploadFile();
  const { refresh } = useRouter();

  const practice = request?.practice;
  const practiceAddress = practice
    ? `${practice.name}, ${practice.addressLine1}, ${practice.town}, ${practice.postcode}`
    : "No practice assigned";
  const practiceEmail = practice?.email ?? "";
  const status = request?.status;

  const defaultValues = {
    firstName: (dentist as any)?.firstName || "",
    lastName: (dentist as any)?.lastName || "",
    email: dentist?.email || "",
    gdcNumber: dentist?.gdcNo || "",
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
    const payload: Partial<TDentistCreate> = {};

    if (dirtyFields.firstName) (payload as any).firstName = formData.firstName;
    if (dirtyFields.lastName) (payload as any).lastName = formData.lastName;
    if (dirtyFields.email) payload.email = formData.email;
    if (dirtyFields.gdcNumber) payload.gdcNo = formData.gdcNumber;

    if (dirtyFields.profileImage && formData.profileImage instanceof File) {
      payload.fileUrl = "uploads/aspire-clinic/images/placeholder.png";
    }

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
            <Label htmlFor="firstName" className="text-lg font-medium">
              First Name<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="firstName"
                    placeholder="Enter your first name"
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
            {errors.firstName && (
              <p className="text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-lg font-medium">
              Last Name<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lastName"
                    placeholder="Enter your last name"
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
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
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

          {/* <div className="space-y-1">
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
          </div> */}

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

        </div>

        <div className="flex flex-col gap-3 mt-10">
          <div className="flex gap-1 items-center">
            Practice Request Status:
            {status ? <StatusBage status={status} /> : <span>N/A</span>}
          </div>
          {!request && (
            <p className="italic font-light">
              No practice request found for this account.
            </p>
          )}
          {status === PracticeApprovalStatus.PENDING && practiceEmail && (
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
          {status === PracticeApprovalStatus.CANCELLED && practiceEmail && (
            <p className="italic font-light">
              Your practice request has been cancelled. If you want to request
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
