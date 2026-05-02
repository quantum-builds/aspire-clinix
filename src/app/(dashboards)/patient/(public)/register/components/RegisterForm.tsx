"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  CalenderInputIconV2,
  EyeCloseIcon,
  EyeOpenIcon,
  TextIconV2,
} from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import { DentistRole } from "@prisma/client";
import { toTitleCase } from "@/utils/formatWords";
import { formatDate } from "@/utils/formatDateTime";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { TPractice } from "@/types/practice";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";
import { Title } from "@/types/patient";
import { useCreatePatient } from "@/services/patient/patientMutation";

export const patientSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be less than 30 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be less than 30 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobilePhone: z
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
  addressLine1: z
    .string()
    .min(1, "Address line 1 is required")
    .max(100, "Address must be less than 100 characters"),
  postCode: z
    .string()
    .min(1, "Postcode is required")
    .regex(
      /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      "Please enter a valid UK postcode",
    ),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Please select a valid date",
  }),
});

type FormData = z.infer<typeof patientSchema>;

const TITLE_OPTIONS = [
  { label: "Mr", value: Title.MR },
  { label: "Mrs", value: Title.MRS },
  { label: "Miss", value: Title.MISS },
  { label: "Ms", value: Title.MS },
  { label: "Dr", value: Title.DR },
  { label: "Master", value: Title.MASTER },
  { label: "Prof", value: Title.PROF },
  { label: "Hon", value: Title.HON },
  { label: "Rev", value: Title.REV },
  { label: "Sir", value: Title.SIR },
  { label: "Lady", value: Title.LADY },
  { label: "Lord", value: Title.LORD },
  { label: "Earl", value: Title.EARL },
  { label: "Judge", value: Title.JUDGE },
  { label: "Dame", value: Title.DAME },
];

interface PatientRegisterFormProps {
  practices: TPractice[];
}

export default function PatientRegisterForm({
  practices,
}: PatientRegisterFormProps) {
  const { mutate: createPatient, isPending: createPatientLoader } =
    useCreatePatient();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      mobilePhone: "",
      addressLine1: "",
      postCode: "",
      dateOfBirth: undefined,
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("dateOfBirth", date, {
        shouldValidate: true,
      });
      setIsCalendarOpen(false);
    }
  };

  const dateOfBirth = watch("dateOfBirth");

  const onSubmit = async (formData: FormData) => {
    createPatient(
      {
        patientData: {
          ...formData,
        },
      },
      {
        onSuccess: () => {
          showToast("success", "Patient Registered Successfully");
          reset();
          router.replace(`/patient/login`);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      },
    );
  };

  return (
    <form
      className="flex flex-col gap-10 max-w-3xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* Title Dropdown */}
        <div className="space-y-2">
          <Label className="text-lg font-medium">
            Title<span className="text-red-500">*</span>
          </Label>

          <Dropdown
            options={TITLE_OPTIONS.map((title) => ({
              value: title.value,
              label: title.label,
            }))}
            value={watch("title") || ""}
            onValueChange={(val) => {
              setValue("title", val as Title, { shouldValidate: true });
            }}
            placeholder="Select Title"
            className="border shadow-sm text-base bg-gray rounded-2xl w-full"
            placeholderClassName="text-sm text-muted-foreground"
            triggerClassName="w-full bg-gray px-6 py-3 h-[52px] rounded-2xl text-left"
            contentClassName="w-full"
          />

          {errors.title && (
            <p className="text-sm text-red-500">{errors.title?.message}</p>
          )}
        </div>
        <div className="md:col-span-1" />

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-lg font-medium">
            First Name<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="firstName"
              placeholder="Enter your first name"
              {...register("firstName")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-lg font-medium">
            Last Name<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="lastName"
              placeholder="Enter your last name"
              {...register("lastName")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="phoneNumber" className="text-lg font-medium">
            Phone Number<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g. +44 7123 456 789"
              {...register("mobilePhone")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.mobilePhone && (
            <p className="text-sm text-red-500">{errors.mobilePhone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2 col-span-2">
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
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        {/* <div className="space-y-2">
          <Label htmlFor="password" className="text-lg font-medium">
            Password<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a strong password"
              {...register("password")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Image
                src={showPassword ? EyeCloseIcon : EyeOpenIcon}
                alt={showPassword ? "Hide password" : "Show password"}
                className="h-4 w-4"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div> */}

        {/* Address Line 1 */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="addressLine1" className="text-lg font-medium">
            Address Line 1<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="addressLine1"
              placeholder="Enter your address"
              {...register("addressLine1")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.addressLine1 && (
            <p className="text-sm text-red-500">
              {errors.addressLine1.message}
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
                className={cn(
                  "relative w-full text-left font-normal bg-gray px-6 py-3 h-[52px] rounded-2xl",
                  !dateOfBirth && "text-muted-foreground",
                )}
              >
                {dateOfBirth ? (
                  <span className="mr-auto">{formatDate(dateOfBirth)}</span>
                ) : (
                  <span className="mr-auto">Select date</span>
                )}
                <Image
                  src={CalenderInputIconV2}
                  alt="calendar-input"
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
            <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Postcode */}
        <div className="space-y-2">
          <Label htmlFor="postcode" className="text-lg font-medium">
            Postcode<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="postcode"
              placeholder="e.g. SW1A 1AA"
              {...register("postCode")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.postCode && (
            <p className="text-sm text-red-500">{errors.postCode.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col items-end justify-center   gap-3">
        <CustomButton
          style="primary"
          text={createPatientLoader ? "Registering..." : "Register"}
          type="submit"
          loading={createPatientLoader}
          className="w-fit py-4 px-20"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link
            href="/dentist/login"
            className="font-medium text-green hover:text-greenHover transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
