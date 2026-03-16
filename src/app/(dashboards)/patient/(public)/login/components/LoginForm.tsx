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
import { useRouter } from "next/navigation";
import { UserRoles } from "@/types/common";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

export const patientSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
    },
  });

  const onSubmit = async (data: FormData) => {
    patientLogin(
      {
        email: data.email,
        password: "643567897",
        role: UserRoles.PATIENT,
      },
      {
        onSuccess: () => {
          showToast("success", "Patient Logged in Successfully");
          reset();
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
      className="flex flex-col gap-6  max-w-lg items-center "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col w-full space-y-2 ">
        {/* Full Name */}
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
        <p
          className={`text-sm h-4 text-red-500 ${errors.email ? "visible" : "invisible"}`}
        >
          {errors.email?.message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <CustomButton
          style="primary"
          text={patientLoginLoader ? "Loggin In..." : "Login"}
          type="submit"
          loading={patientLoginLoader}
          className="py-4 w-full"
        />
      </div>
    </form>
  );
}
