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

const USER_ROLES = [UserRoles.ADMIN, UserRoles.PATIENT, UserRoles.DENTIST];

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    handleSubmit,
    control,
    watch,
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
      // await signIn("credentials", {
      //   email,
      //   password,
      //   role,
      //   redirect: true,
      //   callbackUrl: "/",
      // });
      console.log(" ", email, " ", password, " ", role);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const selectedRole = watch("role");

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
        <div className="mb-6 w-full xl:w-3/5 lg:mx-auto">
          <label className="w-1/3 text-base lg:text-2xl font-normal font-opus text-nowrap mb-4">
            Role
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="flex justify-between items-center w-full gap-2">
                {USER_ROLES.map((role, index) => (
                  <div
                    key={index}
                    className={`p-5 lg:p-9 2xl:p-12 rounded-lg text-lg 2xl:text-2xl text-center cursor-pointer transition-colors bg-[#C9BCA9] text-black" 
                      ${
                        selectedRole === role ? "border-2 border-[#423C36]" : ""
                      }
                    `}
                    onClick={() => field.onChange(role)}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

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

          <button
            type="submit"
            className="w-full h-[45px] py-3 bg-[#423C36] text-white rounded-md font-normal font-opus"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
