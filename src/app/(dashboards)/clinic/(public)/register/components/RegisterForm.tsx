"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { TextInputIcon } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { useCreateAdmin } from "@/services/admin/adminMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";

export const adminSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  profileImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
});

type FormData = z.infer<typeof adminSchema>;

export default function AdminRegisterForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: createAdmin, isPending: createAdminLoader } =
    useCreateAdmin();
  const { mutateAsync: uploadFile, isPending: uploadFileLoader } =
    useUploadFile();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    let fileUrl = undefined;
    if (data.profileImage) {
      const imageUploaded = await uploadFile({
        selectedFile: data.profileImage,
      });
      console.log("image upload ", imageUploaded);

      fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    createAdmin(
      {
        adminCreate: {
          ...data,
          fileUrl: fileUrl,
        },
      },
      {
        onSuccess: () => {
          showToast("success", "Admin Registered Successfully");
          reset();
          router.replace(`/clinic/login`);
        },
        onError: (error) => {
          console.log("error is ", error);
          showToast("error", "Something went wrong");
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file, { shouldValidate: true });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setValue("profileImage", undefined);
      setPreviewUrl(null);
    }
  };

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-8">
        {/* Profile Image Upload */}
        <div className="flex items-center gap-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-[120px] h-[120px] rounded-full object-cover "
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-gray flex items-center justify-center">
              <span className="text-sm text-gray-500">No Image</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Label className="font-medium text-lg">
              Profile Picture (Optional)
            </Label>
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="border border-green"
              onChange={handleImageChange}
            />
            {errors.profileImage && (
              <p className="text-sm text-red-500">
                {errors.profileImage.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-lg font-medium">
              Full Name<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register("fullName")}
                className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-medium">
              Email<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg font-medium">
              Password<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Enter a strong password"
                {...register("password")}
                className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-lg font-medium">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
                className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
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

      {/* Action Buttons */}
      <div className="w-full flex justify-end items-center gap-3">
        <CustomButton
          style="secondary"
          text="Cancel"
          type="reset"
          handleOnClick={() => reset()}
        />
        <CustomButton
          style="primary"
          text={
            createAdminLoader || uploadFileLoader
              ? "Registering..."
              : "Register"
          }
          type="submit"
          loading={createAdminLoader || uploadFileLoader}
        />
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link
          href="/dentist/login"
          className="font-medium text-green hover:text-greenHover transition-colors"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
