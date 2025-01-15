"use client";
import FormInput from "@/components/ui/FormInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import { AspireDarkLogo, Dentist } from "@/assets";
import Image from "next/image";

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;
export default function RegistrationForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <div
      className="w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Dentist.src})` }}
    >
      <div className=" flex justify-center items-center min-h-screen py-[5%] w-full md:w-1/2 flex-col bg-formBackground gap-6 md:gap-12">
        <div className="zoom-out flex justify-center items-center">
          <Image
            src={AspireDarkLogo}
            alt="Aspire Clinix"
            className="w-[90px] h-[50px] md:w-[189px] md:h-[88px]"
          />
        </div>
        <div className="zoom-out flex flex-col gap-5">
          <p className="font-opus font-normal text-[24px]">
            Your referral has been submitted.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 md:gap-9"
          >
            <h1 className="font-opus font-normal text-[24px] md:text-[32px] ">
              CREATE AN ACCOUNT
            </h1>
            <div>
              <FormInput
                type="email"
                name="email"
                label="Email Address"
                control={control}
                errorMessage={errors.email?.message}
                placeholder="Email Address"
                backgroundColor="#DAD7D3"
                marginTop="15px"
                inputMarginTop="10px"
                padding="12px"
                labelTextSize="20px"
                className="w-[312px]"
              />

              <FormInput
                type="password"
                name="password"
                label="Password"
                control={control}
                errorMessage={errors.password?.message}
                placeholder="Password"
                backgroundColor="#DAD7D3"
                marginTop="15px"
                inputMarginTop="10px"
                padding="12px"
                labelTextSize="20px"
                className="w-[312px]"
              />
              <FormInput
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                control={control}
                errorMessage={errors.confirmPassword?.message}
                placeholder="Password"
                backgroundColor="#DAD7D3"
                marginTop="15px"
                inputMarginTop="10px"
                padding="12px"
                labelTextSize="20px"
                className="w-[312px]"
              />
            </div>
            <div className="flex justify-center items-center md:justify-start md:items-start">
              <Button
                type="submit"
                title="Create Account"
                className="w-[153px] h-[45px] bg-feeGuide text-black rounded-[10px] mt-8 md:mt-4"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
