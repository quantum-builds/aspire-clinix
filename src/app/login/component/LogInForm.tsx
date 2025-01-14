"use client";

import AspireLogo from "../../book-treatment/components/AspireLogo";
import { signIn, useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import { UserTypes } from "@/utils/userRoles";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  role: z.enum([UserTypes.PATIENT, UserTypes.DENTIST], {
    errorMap: () => {
      return { message: "Role must be either 'patient' or 'dentist'." };
    },
  }),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: UserTypes.PATIENT,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { email, password, role } = data;
      await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
        callbackUrl: "/dentistry",
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
              className="w-[312px]"
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
              className="w-[312px]"
            />
          </div>

          <div className="mb-6 bg-[#DAD7D3]">
            <label className="block text-[20px] mb-2">Role</label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-[312px] p-3 bg-[#DAD7D3] rounded-md"
                >
                  <option value={UserTypes.PATIENT}>Patient</option>
                  <option value={UserTypes.DENTIST}>Dentist</option>
                </select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-[153px] h-[45px] py-3 bg-feeGuide text-black rounded-md font-normal font-opus"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
