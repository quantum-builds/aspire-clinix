"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalenderInputIconV2, TextIconV2 } from "@/assets";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TPatient, TPatientCreate } from "@/types/patient";
import { formatDate } from "@/utils/formatDateTime";
import { usePatchPatient } from "@/services/patient/patientMutation";
import { GenderType, ResoucrceType } from "@prisma/client";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { showToast } from "@/utils/defaultToastOptions";
import { useRouter } from "next/navigation";
import { getAMedia } from "@/services/s3/s3Query";
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
  dateOfBirth: z
    .preprocess(
      (val) => {
        if (typeof val === "string" && val) {
          return new Date(val);
        }
        return val === "" ? undefined : val;
      },
      z.date({
        required_error: "Date of birth is required",
        invalid_type_error: "Please select a valid date",
      })
    )
    .refine((date) => {
      if (!date) return false;
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 13 && age <= 120;
    }, "You must be between 13 and 120 years old"),
  gender: z.string().min(1, "Please select a gender"),
  country: z.string().min(1, "Please select a country"),
  address: z
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
    z.string().url().or(z.literal("")), // string URL or empty
  ]),
});

type FormData = z.infer<typeof profileFormSchema>;

const genders = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const countries = [
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "India", label: "India" },
  { value: "Brazil", label: "Brazil" },
  { value: "Mexico", label: "Mexico" },
  { value: "Pakistan", label: "Pakistan" },
];

interface ProfileFormProps {
  patient: TPatient;
}

export default function ProfileForm({ patient }: ProfileFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: editPatientInfo, isPending: editPatientInfoLoader } =
    usePatchPatient();
  const { mutateAsync: uploadFile, isPending: uplaodFileLoader } =
    useUploadFile();
  const { refresh } = useRouter();

  const defaultValues = {
    fullName: patient?.fullName || "",
    email: patient?.email || "",
    phoneNumber: patient?.phoneNumber || "",
    address: patient?.address || "",
    dateOfBirth: patient?.dateOfBirth
      ? new Date(patient.dateOfBirth)
      : undefined,
    gender: patient?.gender || undefined,
    country: patient?.country || undefined,
    profileImage: patient?.file || undefined,
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
    console.log("Form submitted:", formData);

    let payload: Partial<TPatientCreate> = {};

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
          const file = await getAMedia(data.fileUrl || "");

          reset(
            {
              fullName: data.fullName,
              email: data.email,
              phoneNumber: data.phoneNumber,
              dateOfBirth: data.dateOfBirth
                ? new Date(data.dateOfBirth)
                : undefined,
              gender: data.gender,
              country: data.country,
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("dateOfBirth", date, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setIsCalendarOpen(false);
    }
  };

  const profileImage = watch("profileImage");
  const dateOfBirth = watch("dateOfBirth");

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
            <Label className="text-lg font-medium">
              Date of Birth<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "relative w-full text-left font-normal bg-gray px-6 py-3 h-[52px] rounded-2xl ",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                >
                  {dateOfBirth ? (
                    <span className="mr-auto">{formatDate(dateOfBirth)} </span>
                  ) : (
                    <span className="mr-auto">Select date</span>
                  )}
                  <Image
                    src={CalenderInputIconV2}
                    alt="calender-input"
                    className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={handleDateSelect}
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
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-medium">
              Gender<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-medium">
              Country<span className="text-red-500 text-sm ml-1">*</span>
            </Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-1 col-span-2">
            <Label htmlFor="address" className="text-lg font-medium">
              Address
            </Label>
            <div className="relative">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="address"
                    placeholder="Enter your address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextIconV2}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
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
