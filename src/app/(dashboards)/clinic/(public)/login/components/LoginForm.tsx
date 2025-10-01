"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { EyeCloseIcon, EyeOpenIcon, TextIconV2 } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import Link from "next/link";
import { loginMutation } from "@/services/LoginMutation";
import { showToast } from "@/utils/defaultToastOptions";
import { useRouter } from "next/navigation";
import { UserRoles } from "@/types/common";
import { useState } from "react";

export const adminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

type FormData = z.infer<typeof adminSchema>;

export default function AdminLoginForm() {
  const { mutate: adminLogin, isPending: adminLoginLoader } = loginMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    adminLogin(
      {
        email: data.email,
        password: data.password,
        role: UserRoles.ADMIN,
      },
      {
        onSuccess: () => {
          showToast("success", "Admin Logged in Successfully");
          reset();
          router.replace(`/clinic`);
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
      className="flex flex-col gap-10  max-w-lg items-center "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-8 items-center w-full ">
        {/* Form Fields */}
        <div className="flex flex-col gap-8 w-full">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-medium">
              Email<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
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
                placeholder="Enter password"
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col justify-center items-center gap-3 ">
        <CustomButton
          style="primary"
          text={adminLoginLoader ? "Logging In..." : "Login"}
          type="submit"
          loading={adminLoginLoader}
          className="py-4 w-full"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Don’t have an account?{" "}
          <Link
            href="/clinic/register"
            className="font-medium text-green hover:text-greenHover transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
}
