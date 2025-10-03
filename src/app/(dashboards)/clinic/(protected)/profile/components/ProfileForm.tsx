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
import { TAdmin, TAdminCreate } from "@/types/admin";
import { usePatchAdmin } from "@/services/admin/adminMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { ResoucrceType } from "@prisma/client";
import { showToast } from "@/utils/defaultToastOptions";
import { useRouter } from "next/navigation";
import { getAMedia } from "@/services/s3/s3Query";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number"
    ),
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

interface AdminFormProps {
  admin: TAdmin;
}

export default function ProfileForm({ admin }: AdminFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { refresh } = useRouter();

  const { mutate: editAdminInfo, isPending: editAdminInfoLoader } =
    usePatchAdmin();
  const { mutateAsync: uploadFile, isPending: uplaodFileLoader } =
    useUploadFile();

  // Use const for defaultValues - it will be recreated on each render with new admin prop
  const defaultValues: Partial<FormData> = {
    fullName: admin?.fullName,
    email: admin?.email,
    phoneNumber: admin?.phoneNumber,
    profileImage: admin?.file || undefined,
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

  const onSubmit = async (formData: FormData) => {
    console.log("Form submitted:", formData);

    let payload: Partial<TAdminCreate> = {};

    // Loop through dirty fields
    Object.keys(dirtyFields).forEach((field) => {
      const key = field as keyof FormData;

      // Skip profileImage if it's a File, handle it separately
      if (key === "profileImage" && formData.profileImage instanceof File) {
        return;
      }

      payload[key as keyof TAdminCreate] = formData[key] as any;
    });

    // Handle profileImage upload if changed
    if (dirtyFields.profileImage && formData.profileImage instanceof File) {
      const imageUploaded = await uploadFile({
        selectedFile: formData.profileImage,
        fileType: ResoucrceType.IMAGES,
      });

      payload.fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    // If no changes
    if (Object.keys(payload).length === 0) {
      showToast("info", "No changes to update");
      return;
    }

    editAdminInfo(
      { partialAdmin: payload },
      {
        onSuccess: async (data) => {
          showToast("success", "Profile Updated Successfully");

          const file = await getAMedia(data.fileUrl || "");

          reset(
            {
              fullName: data.fullName,
              email: data.email,
              phoneNumber: data.phoneNumber,
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
                    placeholder="Enter full name"
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
                    placeholder="Enter phone number"
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
      </div>

      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          text="Cancel"
          handleOnClick={handleCancel}
          disabled={!isDirty || uplaodFileLoader || editAdminInfoLoader}
          className="text-[#A3A3A3] h-[60px] w-fit px-6 py-3 bg-gray hover:bg-lightGray shadow-none font-medium text-xl"
        />

        <CustomButton
          type="submit"
          text="Save Changes"
          disabled={!isDirty || uplaodFileLoader || editAdminInfoLoader}
          loading={uplaodFileLoader || editAdminInfoLoader}
          className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-greenHover flex items-center justify-center gap-2 rounded-[100px]"
        />
      </div>
    </form>
  );
}
