"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useEffect } from "react";
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
import { CalenderInputIcon, TextInputIcon } from "@/assets";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TPatient, TPatientCreate } from "@/types/patient";
import { formatDate } from "@/utils/formatDateTime";
import { usePatchPatient } from "@/services/patient/patientMutation";
import { GenderType } from "@prisma/client";
import { useUploadFile } from "@/services/s3/s3Mutatin";

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
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  dateOfBirth: z
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please select a valid date",
    })
    .refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 13 && age <= 120;
    }, "You must be between 13 and 120 years old"),
  gender: z.string().min(1, "Please select a gender"),
  country: z.string().min(1, "Please select a country"),
  // profileImage can be File (for uploads) or string (server URL)
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
  const [hasChanges, setHasChanges] = useState(false);
  const { mutate: editPatientInfo } = usePatchPatient();
  const { mutateAsync: uploadFile } = useUploadFile();

  // Default values constant
  const defaultValues = {
    fullName: patient?.fullName || "",
    email: patient?.email || "",
    phoneNumber: patient?.phoneNumber || "",
    dateOfBirth:
      patient?.dateOfBirth || ""
        ? new Date(patient.dateOfBirth || "")
        : new Date(), // make sure it’s always a Date
    gender: patient?.gender || undefined,
    country: patient?.country || undefined,
    profileImage: patient?.file || undefined,
  };

  // const defaultValues = {
  //   fullName: "",
  //   email: "",
  //   phoneNumber: "",
  //   dateOfBirth: new Date(),
  //   gender: "",
  //   country: "",
  //   profileImage: undefined,
  // };

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

  const watchedValues = watch();

  // Check if form values have changed from default values
  useEffect(() => {
    const isChanged =
      watchedValues.fullName !== defaultValues.fullName ||
      watchedValues.email !== defaultValues.email ||
      watchedValues.phoneNumber !== defaultValues.phoneNumber ||
      (watchedValues.dateOfBirth instanceof Date &&
        defaultValues.dateOfBirth instanceof Date &&
        watchedValues.dateOfBirth.toISOString() !==
          defaultValues.dateOfBirth.toISOString()) ||
      watchedValues.gender !== defaultValues.gender ||
      watchedValues.country !== defaultValues.country ||
      watchedValues.profileImage !== defaultValues.profileImage;

    setHasChanges(isChanged);
  }, [watchedValues]);

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    // Handle form submission here

    let fileUrl = "uploads/aspire-clinic/images/placeholder.png";
    if (data.profileImage instanceof File) {
      const imageUploaded = await uploadFile({
        selectedFile: data.profileImage,
      });

      fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    const payload: Partial<TPatientCreate> = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as GenderType,
      country: data.country,
      fileUrl: fileUrl,
    };

    editPatientInfo(
      {
        partialPatient: payload,
        id: patient.id,
      },
      {
        onSuccess: (data) => {
          // console.log("dataaa is ", data);
          // console.log("sucess");
          // reset({
          //   fullName: data.fullName || "",
          //   email: data.email || "",
          //   phoneNumber: data.phoneNumber || "",
          //   dateOfBirth: data.dateOfBirth || new Date(),
          //   gender: data.gender || undefined,
          //   country: data.country || undefined,
          //   profileImage: data.file,
          // });
          setHasChanges(false);
        },
      }
    );
  };

  const handleCancel = () => {
    reset(defaultValues);
    setHasChanges(false);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Validate the image file using Zod
  //     try {
  //       const imageSchema = z
  //         .instanceof(File)
  //         .refine(
  //           (file) => file.size <= 5 * 1024 * 1024,
  //           "Image must be less than 5MB"
  //         )
  //         .refine(
  //           (file) =>
  //             ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
  //               file.type
  //             ),
  //           "Only JPEG, PNG, and WebP images are allowed"
  //         );

  //       imageSchema.parse(file);

  //       const imageUrl = URL.createObjectURL(file);
  //       setImage(imageUrl);
  //       // setValue("profileImage", file);
  //     } catch (error) {
  //       setImage(null);
  //       console.error("Image validation failed:", error);
  //     }
  //   } else {
  //     setImage(null);
  //   }
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } else {
      setValue("profileImage", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("dateOfBirth", date);
      setIsCalendarOpen(false);
    }
  };

  // console.log("profile image is ", watchedValues.profileImage);
  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-dashboardBarBackground rounded-2xl p-6 flex flex-col gap-8">
        <p className="font-medium text-2xl text-green">Your Details</p>
        <div className="flex items-center gap-4">
          {watchedValues.profileImage ? (
            typeof watchedValues.profileImage === "string" ? (
              <Image
                src={watchedValues.profileImage}
                alt="Profile Preview"
                width={120}
                height={120}
                priority
                className=" w-[120px] h-[120px] object-cover"
              />
            ) : (
              <Image
                src={URL.createObjectURL(watchedValues.profileImage)}
                alt="Profile Preview"
                width={120}
                height={120}
                priority
                className=" w-[120px] h-[120px] object-cover"
              />
            )
          ) : (
            <span className="text-sm text-gray-500">No Image</span>
          )}

          <div className="flex flex-col gap-3">
            <Label className="font-medium text-lg">Profile Picture</Label>
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
            />
            {errors.profileImage && (
              <p className="text-sm text-red-500">
                {errors.profileImage.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
          <div className="space-y-2">
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
                src={TextInputIcon}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
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
                src={TextInputIcon}
                alt="text-input"
                className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
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
                    !watchedValues.dateOfBirth && "text-muted-foreground"
                  )}
                >
                  {watchedValues.dateOfBirth ? (
                    <span className="mr-auto">
                      {formatDate(watchedValues.dateOfBirth)}{" "}
                    </span>
                  ) : (
                    <span className="mr-auto">Select date</span>
                  )}
                  <Image
                    src={CalenderInputIcon}
                    alt="calender-input"
                    className="cursor-pointer absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Calendar
                  mode="single"
                  selected={watchedValues.dateOfBirth}
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

          <div className="space-y-2">
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

          <div className="space-y-2">
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
        </div>
      </div>

      {/* Conditionally render buttons only when there are changes */}
      {hasChanges && (
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            className="text-[#A3A3A3] bg-transparent shadow-none hover:bg-transparent font-medium text-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-green flex items-center justify-center gap-2 rounded-[100px]"
          >
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
