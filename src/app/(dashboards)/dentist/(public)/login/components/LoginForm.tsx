"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { TextIconV2 } from "@/assets";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { z } from "zod";
import { useVerifyDentist } from "@/services/dentist/dentistMutation";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { useRouter } from "next/navigation";

export const dentistsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  GdcNumber: z.string().min(1, "Gdc Number is required"),
});

type FormData = z.infer<typeof dentistsSchema>;

export default function DentistLoginForm() {
  const { mutate: verifyDentist, isPending: verifyDentistLoader } =
    useVerifyDentist();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(dentistsSchema),
    defaultValues: {
      email: "",
      GdcNumber: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    verifyDentist(
      {
        email: data.email,
        gdcNumber: data.GdcNumber,
      },
      {
        onSuccess: (resData) => {
          showToast("success", "OTP sent successfully");
          router.replace(`dentist/otp-verify?email=${resData.email}`);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", "Verification failed. Please try again later.");
        },
      },
    );
  };

  const isSubmitting = verifyDentistLoader;

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

          {/* Gdc Number */}
          <div className="space-y-2">
            <Label htmlFor="GdcNumber" className="text-lg font-medium">
              Gdc Number<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="GdcNumber"
                type={"text"}
                placeholder="Enter Gdc Number"
                {...register("GdcNumber")}
                className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
              />
              <Image
                src={TextIconV2}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.GdcNumber && (
              <p className="text-sm text-red-500">{errors.GdcNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <CustomButton
          style="primary"
          text={isSubmitting ? "Loggin In..." : "Login"}
          type="submit"
          loading={isSubmitting}
          className="py-4 w-full"
        />
      </div>
    </form>
  );
}
