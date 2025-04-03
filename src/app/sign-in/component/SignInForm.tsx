"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/CustomButton";
import Cookies from "js-cookie";
import AspireLogo from "@/components/AspireLogo";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type FormData = z.infer<typeof formSchema>;

const SigninForm = () => {
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
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email } = data;
    const callback = searchParams.get("callback");

    Cookies.set("key", email, { expires: 7, path: "/" });

    router.push(callback || "/");
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-grey100 font-opus text-[#382F26]">
      <div className="absolute top-5 flex flex-col gap-6">
        <AspireLogo />
        <div className="text-center">Patient Dashboard</div>
        <h2 className=" text-center text-[24px] md:text-[32px] font-normal font-opus">
          Sign In
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
          <div className="flex justify-center items-center md:justify-start md:items-start ">
            <Button
              type="submit"
              title="Sign In"
              className="w-[153px] h-[45px] bg-feeGuide text-black rounded-[10px] mt-8 md:mt-4"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SigninForm;
