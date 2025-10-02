"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { TextInputIcon } from "@/assets";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  profileImage: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      "Image must be less than 5MB"
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

type FormData = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<FormData> = {
  fullName: "",
  email: "",
  phoneNumber: "",
  profileImage: undefined,
};

export default function SimpleProfileForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const watched = watch();

  const [hasChanges, setHasChanges] = useState(false);
  useEffect(() => {
    const isChanged =
      watched.fullName !== defaultValues.fullName ||
      watched.email !== defaultValues.email ||
      watched.phoneNumber !== defaultValues.phoneNumber ||
      ((watched.profileImage as File | undefined)?.name ?? undefined) !==
        (defaultValues.profileImage as File | undefined)?.name;
    setHasChanges(isChanged);
  }, [watched]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setHasChanges(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setImagePreview(null);
    setHasChanges(false);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-dashboardBarBackground rounded-2xl p-6 flex flex-col gap-5">
        <p className="font-semibold text-[22px] text-green">Your Details</p>

        <div className="flex items-center gap-6">
          <div className="bg-gray rounded-2xl h-[120px] w-[120px] overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile Preview"
                width={120}
                height={120}
                className="h-full w-full object-cover"
              />
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
                src={TextInputIcon}
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
                src={TextInputIcon}
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
                src={TextInputIcon}
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

      {hasChanges && (
        <div className="w-full flex justify-end items-center gap-3">
          <CustomButton
            type="button"
            text="Cancel"
            handleOnClick={handleCancel}
            className="text-[#A3A3A3] bg-transparent shadow-none hover:bg-transparent font-medium text-xl"
          />
          <CustomButton text="Save Changes" type="submit" />
        </div>
      )}
    </form>
  );
}
