"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { EyeCloseIcon, EyeOpenIcon, TextIconV2, TextInputIcon } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import Link from "next/link";
import { useCreatePatient } from "@/services/patient/patientMutation";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { useState } from "react";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

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
    .max(15, "Phone number must be at most 15 digits")
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number"
    ),
});

type FormData = z.infer<typeof patientSchema>;

export default function PatientRegisterForm() {
  const { mutate: createPatient, isPending: createPatientLoader } =
    useCreatePatient();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    createPatient(
      {
        patientCreate: {
          ...data,
        },
      },
      {
        onSuccess: () => {
          showToast("success", "Patient Registered Successfully");
          reset();
          router.replace(`/patient/login`);
        },
        onError: (error: any) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      }
    );
  };

  return (
    <form
      className="flex flex-col gap-10 max-w-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-8">
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
              src={TextIconV2}
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
        <div className="space-y-2">
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
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col justify-center items-center gap-3">
        {/* <CustomButton
          style="secondary"
          text="Cancel"
          type="reset"
          handleOnClick={() => reset()}
        /> */}
        <CustomButton
          style="primary"
          text={createPatientLoader ? "Registering..." : "Register"}
          type="submit"
          loading={createPatientLoader}
          className=" py-4 w-full"
        />
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/patient/login"
            className="font-medium text-green hover:text-greenHover transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
