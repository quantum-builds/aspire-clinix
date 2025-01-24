"use client";

import AspireLogo from "@/app/patient/book-treatment/components/AspireLogo";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { UserRoles } from "@/constants/UserRoles";
import { useState } from "react";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  role: z.enum([UserRoles.PATIENT, UserRoles.DENTIST, UserRoles.ADMIN], {
    errorMap: () => {
      return { message: "Role must be either 'patient' or 'dentist'." };
    },
  }),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: UserRoles.PATIENT,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { email, password, role } = data;
      await signIn("credentials", {
        email,
        password,
        role,
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-grey100 font-opus text-[#382F26]">
      <div className="absolute top-5">
        <AspireLogo />
        <h2 className="mb-8 mt-5 text-center text-[24px] md:text-[32px] font-normal font-opus">
          Login
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-1/2 h-full p-6 flex flex-col items-center justify-center bg-formBackground"
      >
        <div className="w-full md:w-1/2">
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          <div className="mb-6">
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
              className="w-full"
            />
          </div>

          <div className="mb-6">
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
              className="w-full"
            />
          </div>

          <div className="mb-6 ">
            <label className="block text-[20px] mb-2">Role</label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-[312px] p-3 bg-[#DAD7D3] rounded-md border-[1px] border-[#000000]"
                >
                  <option value={UserRoles.PATIENT}>Patient</option>
                  <option value={UserRoles.DENTIST}>Dentist</option>
                  <option value={UserRoles.ADMIN}>Admin</option>
                </select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[45px] py-3 bg-feeGuide text-black rounded-md font-normal font-opus"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
