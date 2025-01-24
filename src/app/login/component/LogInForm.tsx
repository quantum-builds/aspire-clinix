"use client";

import AspireLogo from "@/app/patient/book-treatment/components/AspireLogo";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {
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
