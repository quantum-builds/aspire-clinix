"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { TextIconV2 } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import { loginMutation } from "@/services/LoginMutation";
import { UserRoles } from "@/types/common";
import { useSearchParams, useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

export const dentistsSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

type FormData = z.infer<typeof dentistsSchema>;

export default function DentsitOtpVerfiy() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const { mutate: dentistLogin, isPending: dentistLoginLoader } =
    loginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(dentistsSchema),
    defaultValues: {
      otp: "",
    },
  });

 const onSubmit = async (data: FormData) => {
    dentistLogin(
      {
        email: email,
        otp: data.otp,
        role: UserRoles.DENTIST,
      },
      {
        onSuccess: () => {
          showToast("success", "Dentist Logged in Successfully");
          router.replace(`/dentist`);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      },
    );
  };

  const isSubmitting = dentistLoginLoader;

  return (
    <form
      className="flex flex-col gap-10 max-w-lg items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-8 items-center w-full">
        {/* Form Fields */}
        <div className="flex flex-col gap-8 w-full">
          <div className="space-y-2">
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

        <div className="w-full flex flex-col justify-center items-center gap-3">
          <CustomButton
            style="primary"
            text={isSubmitting ? "Verifying..." : "Verify"}
            type="submit"
            loading={isSubmitting}
            className="py-4 w-full"
          />
        </div>
      </div>
    </form>
  );
}
