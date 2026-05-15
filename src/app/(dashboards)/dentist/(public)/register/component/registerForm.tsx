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
import { useCreateUser } from "@/services/patient/patientMutation";
import { TokenRoles } from "@/constants/UserRoles";

export const patientSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be less than 30 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be less than 30 characters"),
  email: z.string().email("Please enter a valid email address"),
  gdcNo: z
    .string()
    .min(1, "GDC number is required")
    .max(100, "GDC number must be less than 100 characters"),
});

type FormData = z.infer<typeof patientSchema>;

export default function DentistRegisterForm() {
  const { mutate: createDentist, isPending: createDentistLoader } =
    useCreateUser();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gdcNo: "",
    },
  });

  const onSubmit = async (formData: FormData) => {
    createDentist(
      {
        patientData: {
          ...formData,
          emailAddress: formData.email,
          role: TokenRoles.REFERRING_DENTIST,
        },
      },
      {
        onSuccess: () => {
          showToast("success", "Dentist Registered Successfully");
          reset();
          router.replace(`/dentist/login`);
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
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-lg font-medium">
            Gdc Number<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="gdcNumber"
              placeholder="Enter your Gdc number"
              {...register("gdcNo")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.gdcNo && (
            <p className="text-sm text-red-500">{errors.gdcNo.message}</p>
          )}
        </div>
        <div></div>

        {/* Action Buttons */}
      </div>
      <div className="w-full flex flex-col items-end justify-end  gap-3">
        <CustomButton
          style="primary"
          text={createDentistLoader ? "Registering..." : "Register"}
          type="submit"
          loading={createDentistLoader}
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
