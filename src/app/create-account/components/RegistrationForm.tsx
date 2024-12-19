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
      className="w-full h-screen flex justify-center items-center font-opus text-[#382F26]  bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Dentist.src})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-1/2 h-full pl-3 md:pl-0 flex flex-col items-center justify-center bg-[#DAD7D3]"
      >
        <div className="w-[100%] md:w-[50%]">
          <Image
            src={AspireDarkLogo}
            alt="Aspire Clinix"
            width={80}
            height={88}
            className="ml-24 md:mb-4"
          />
          <p className="text-[16px] sm:text-[24px] font-normal text-nowrap">
            Your referral has been submitted.
          </p>

          <h1 className="mt-3 text-[20px] text-nowrap md:text-[32px] font-normal">
            CREATE AN ACCOUNT
          </h1>

          {/** Email Input */}
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

          {/** Password Input */}
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

          {/** Confirm Password Input */}
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

          {/** Submit Button */}
          <div className="mt-10 text-left">
            <Button
              type="submit"
              title="Create Account"
              className="w-[90px] sm:w-[153px] h-[45px] bg-white text-black rounded-[10px]"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
