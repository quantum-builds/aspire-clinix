"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { TextIconV2 } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import Link from "next/link";
import {loginMutation} from "@/services/LoginMutation";
import { TokenRoles } from "@/constants/UserRoles";

const otpSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

type FormData = z.infer<typeof otpSchema>;

function LoadingFallback() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8">
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-[52px] bg-gray-200 rounded-2xl animate-pulse w-full" />
        </div>
      </div>
      <div className="h-[52px] bg-gray-200 rounded-2xl animate-pulse w-full" />
    </div>
  );
}

function OtpVerificationForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const { mutate: login, isPending: isCreate } = loginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!email) {
      showToast("error", "No email found. Please register again.");
      router.replace("/clinic/register");
      return;
    }
    login(
      { email, otp: data.otp, role: TokenRoles.ADMIN },
      {
        onSuccess: () => {
          showToast("success", "Admin Login successfully");
          router.replace("/clinic");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* OTP Field */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="otp" className="text-lg font-medium">
            OTP<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="otp"
              placeholder="Enter OTP"
              {...register("otp")}
              className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
            />
            <Image
              src={TextIconV2}
              alt="icon"
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
          {errors.otp && (
            <p className="text-sm text-red-500">{errors.otp.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col items-end justify-center gap-3">
        <CustomButton
          style="primary"
          text={isCreate ? "Verifying..." : "Verify"}
          type="submit"
          loading={isCreate}
          className="w-fit py-4 px-20"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Didn&apos;t receive the code?{" "}
          <Link
            href="/clinic/login"
            className="font-medium text-green hover:text-greenHover transition-colors"
          >
            Go back to login
          </Link>
        </p>
      </div>
    </form>
  );
}

export default function PatientOtpVerifyForm() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OtpVerificationForm />
    </Suspense>
  );
}
