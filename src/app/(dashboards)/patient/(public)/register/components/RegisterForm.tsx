"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { CalenderInputIconV2, TextInputIcon } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import { GenderType } from "@prisma/client";
import { capitalize } from "@/utils/formatWords";
import { COUNTRIES } from "@/utils/coutries";
import Link from "next/link";
import { useCreatePatient } from "@/services/patient/patientMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";

export const patientSchema = z.object({
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
  dateOfBirth: z.date({ required_error: "Date of birth is required" }).refine(
    (date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 13 && age <= 120;
    },
    { message: "You must be between 13 and 120 years old" }
  ),
  gender: z.nativeEnum(GenderType, {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  country: z.string().min(1, "Please select a country"),
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

const genders = [
  { value: GenderType.MALE, label: capitalize(GenderType.MALE) },
  { value: GenderType.FEMALE, label: capitalize(GenderType.FEMALE) },
  { value: GenderType.OTHER, label: capitalize(GenderType.OTHER) },
];

type FormData = z.infer<typeof patientSchema>;

export default function PatientRegisterForm() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { mutate: createPatient, isPending: createPatientLoader } =
    useCreatePatient();
  const { mutateAsync: uploadFile, isPending: uploadFileLoader } =
    useUploadFile();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      gender: undefined,
      country: "",
      dateOfBirth: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    let fileUrl = undefined;
    console.log("data is ", data);
    if (data.profileImage) {
      const imageUploaded = await uploadFile({
        selectedFile: data.profileImage,
      });
      console.log("image upload ", imageUploaded);

      fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    createPatient(
      {
        patientCreate: {
          ...data,
          fileUrl: fileUrl,
        },
      },
      {
        onSuccess: () => {
          showToast("success", "Patient Registered Successfully");
          reset();
          router.replace(`/patient/login`);
        },
        onError: (error) => {
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

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">
              Date of Birth<span className="text-red-500">*</span>
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={`relative w-full text-left font-normal bg-gray px-6 py-3 h-[52px] rounded-2xl ${
                    !watch("dateOfBirth") ? "text-muted-foreground" : ""
                  }`}
                >
                  {watch("dateOfBirth")
                    ? formatDate(watch("dateOfBirth") as Date)
                    : "Select date"}
                  <Image
                    src={CalenderInputIconV2}
                    alt="icon"
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Calendar
                  mode="single"
                  selected={watch("dateOfBirth")}
                  onSelect={(date) => {
                    setValue("dateOfBirth", date as Date, {
                      shouldValidate: true,
                    });
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  captionLayout="dropdown"
                  showOutsideDays={false}
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">
                {errors.dateOfBirth.message as string}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">
              Gender<span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) =>
                setValue("gender", val as GenderType, { shouldValidate: true })
              }
              value={watch("gender")}
            >
              <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">
              Country<span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) =>
                setValue("country", val, { shouldValidate: true })
              }
              value={watch("country")}
            >
              <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
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
            createPatientLoader || uploadFileLoader
              ? "Registering..."
              : "Register"
          }
          type="submit"
          loading={createPatientLoader || uploadFileLoader}
        />
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link
          href="/patient/login"
          className="font-medium text-green hover:text-greenHover transition-colors"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
