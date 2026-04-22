"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { CalenderInputIconV2, TextIconV2 } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDateTime";
import { loginMutation } from "@/services/LoginMutation";
import { UserRoles } from "@/types/common";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import Link from "next/link";

export const patientSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be less than 100 characters"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Please select a valid date",
  }),
  phoneNumber: z
    .string()
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number"
    )
    .refine(
      (val) => {
        const digitsOnly = val.replace(/\s+/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      { message: "Phone number must be between 10 and 15 digits" }
    )
    .transform((val) => val.replace(/\s+/g, "")),
});

type FormData = z.infer<typeof patientSchema>;

export default function PatientLoginForm() {
  const { mutate: patientLogin, isPending: patientLoginLoader } =
    loginMutation();
  const router = useRouter();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      phoneNumber: "",
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

  const onSubmit = async (data: FormData) => {
    patientLogin(
      {
        email: "",
        password: undefined,
        role: UserRoles.PATIENT,
      },
      {
        onSuccess: () => {
          showToast("success", "Patient Logged in Successfully");
          router.replace(`/patient`);
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
      className="flex flex-col gap-6 max-w-3xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
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

        {/* Date of Birth */}
        <div className="space-y-2 ">
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
                  !dateOfBirth && "text-muted-foreground"
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
            <p className="text-sm text-red-500">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
        <div className="md:col-span-1" />

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-lg font-medium">
            Phone Number<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g. +44 7123 456 789"
              {...register("phoneNumber")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
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

      {/* Action Buttons */}
      <div className="w-full flex flex-col justify-center items-center ">
        <CustomButton
          style="primary"
          text={patientLoginLoader ? "Logging In..." : "Login"}
          type="submit"
          loading={patientLoginLoader}
           className="w-fit py-4 px-20"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link
            href="/patient/register"
            className="font-medium text-green hover:text-greenHover transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
}