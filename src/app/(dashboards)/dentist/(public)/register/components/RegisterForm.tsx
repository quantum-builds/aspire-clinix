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
import {
  CalenderInputIconV2,
  EyeCloseIcon,
  EyeOpenIcon,
  TextIconV2,
  TextInputIcon,
} from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import {
  DentistRole,
  GenderType,
  PracticeApprovalStatus,
} from "@prisma/client";
import { capitalize, toTitleCase } from "@/utils/formatWords";
import { COUNTRIES } from "@/utils/coutries";
import Link from "next/link";
import { useCreateDentist } from "@/services/dentist/dentistMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { TPractice } from "@/types/practice";
import { useCreateDentistPractice } from "@/services/dentistOnPractice/dentistOnPracticeQuery";

export const dentistSchema = z.object({
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
  gdcNo: z
    .string()
    .regex(/^\d+$/, "GDC number must contain only digits")
    .min(4, "GDC number must be at least 4 digits")
    .max(6, "GDC number must be at most 6 digits"),

  practiceId: z.string().min(1, "Please select a practice address"),
  practiceAddress: z.string().min(1, "Practice address is required"),

  role: z.nativeEnum(DentistRole, {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

const roles = [
  {
    value: DentistRole.RECIEVING_DENTIST,
    label: toTitleCase(DentistRole.RECIEVING_DENTIST),
  },
  {
    value: DentistRole.REFERRING_DENTIST,
    label: toTitleCase(DentistRole.REFERRING_DENTIST),
  },
  { value: DentistRole.DENTIST, label: toTitleCase(DentistRole.DENTIST) },
];

type FormData = z.infer<typeof dentistSchema>;

interface DentistRegisterFormProps {
  practices: TPractice[];
}

export default function DentistRegisterForm({
  practices,
}: DentistRegisterFormProps) {
  // console.log(practices)
  const { mutate: createDentist, isPending: createDentistLoader } =
    useCreateDentist();

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(dentistSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      gdcNo: "",
      practiceId: "",
      practiceAddress: "",
      role: undefined,
    },
  });

  const onSubmit = async (formData: FormData) => {
    createDentist(
      {
        dentistCreate: {
          ...formData,
        },
      },
      {
        onSuccess: () => {
          showToast("success", "Dentist Registered Successfully");
          reset();
          router.replace(`/dentist/login`);
        },
        onError: (error) => {
          showToast("error", "Something went wrong");
          console.log("error is ", error);
        },
      }
    );
  };

  return (
    <form
      className="flex flex-col gap-10 max-w-4xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
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

        {/* GDC Number */}
        <div className="space-y-2">
          <Label htmlFor="gdcNo" className="text-lg font-medium">
            GDC Number<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="gdcNo"
              type="tel"
              placeholder="Enter your gdc number"
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

        {/* Practice Address */}
        <div className="space-y-2">
          <Label className="text-lg font-medium">
            Practice Address<span className="text-red-500">*</span>
          </Label>

          {practices && practices.length > 0 ? (
            <Select
              onValueChange={(val) => {
                const selectedPractice = practices.find((p) => p.id === val);
                setValue("practiceId", val, { shouldValidate: true });
                if (selectedPractice) {
                  setValue(
                    "practiceAddress",
                    `${selectedPractice.name}, ${selectedPractice.addressLine1}, ${selectedPractice.town}, ${selectedPractice.postcode}`,
                    { shouldValidate: true }
                  );
                }
              }}
              value={watch("practiceId")}
            >
              <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                <SelectValue placeholder="Select practice address" />
              </SelectTrigger>
              <SelectContent>
                {practices.map((practice) => (
                  <SelectItem key={practice.id} value={practice.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{practice.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {practice.addressLine1}, {practice.town},{" "}
                        {practice.postcode}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              disabled
              value="No practice registered yet"
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl text-muted-foreground"
            />
          )}

          {errors.practiceId && (
            <p className="text-sm text-red-500">{errors.practiceId.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label className="text-lg font-medium">
            Role<span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(val) =>
              setValue("role", val as DentistRole, { shouldValidate: true })
            }
            value={watch("role")}
          >
            <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col items-end justify-center   gap-3">
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
