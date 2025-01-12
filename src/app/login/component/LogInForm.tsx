"use client";

import AspireLogo from "../../book-treatment/components/AspireLogo";
import { signIn, useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
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
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { email, password } = data;
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dentistry",
      });

      const cred = useSession();
      console.log("credentials are", cred);
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
