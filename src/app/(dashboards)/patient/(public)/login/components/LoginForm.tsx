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
import { loginMutation } from "@/services/LoginMutation";
import { useRouter } from "next/navigation";
import { UserRoles } from "@/types/common";
import { showToast } from "@/utils/defaultToastOptions";

export const patientSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
});

type FormData = z.infer<typeof patientSchema>;

export default function PatientLoginForm() {
  const { mutate: patientLogin, isPending: patientLoginLoader } =
    loginMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    patientLogin(
      {
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        role: UserRoles.PATIENT,
      },
      {
        onSuccess: () => {
          showToast("success", "Patient Logged in Successfully");
          reset();
          router.replace(`/patient`);
        },
        onError: (error) => {
          console.log("error is ", error);
          showToast("error", "Something went wrong");
        },
      }
    );
  };

  return (
    <form
      className="flex flex-col gap-7  max-w-lg items-center "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-8 items-center w-full ">
        {/* Form Fields */}
        <div className="flex flex-col gap-8 w-full">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-medium">
              Full Name<span className="text-red-500">*</span>
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
          text={patientLoginLoader ? "Loggin In..." : "Login"}
          type="submit"
          loading={patientLoginLoader}
        />
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Don’t have an account?{" "}
        <Link
          href="/patient/register"
          className="font-medium text-green hover:text-greenHover transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
