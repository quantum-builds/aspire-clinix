"use client";
import FormInput from "@/components/ui/FormInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  confirmPassword: z.string().min(6, "Password is not matching."),
});
type FormData = z.infer<typeof formSchema>;
export default function RegistrationForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#ACACAC] font-opus text-[#382F26]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 h-full flex flex-col items-center justify-center bg-[#DAD7D3]"
      >
        <div className="w-[58%] p-5">
          <p className="text-[24px] font-normal">
            Your referral has been submitted.
          </p>

          <h1 className="mt-10 text-[32px] font-normal">CREATE AN ACCOUNT</h1>

          {/** Email Input */}
          <FormInput
            type="email"
            name="email"
            label="Email Address"
            control={control}
            errorMessage={errors.email?.message}
            placeholder="Email Address"
            backgroundColor="#DAD7D3"
            marginTop="20px"
            inputMarginTop="10px"
            padding="12px"
            labelTextSize="20px"
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
            marginTop="20px"
            inputMarginTop="10px"
            padding="12px"
            labelTextSize="20px"
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
            marginTop="20px"
            inputMarginTop="10px"
            padding="12px"
            labelTextSize="20px"
          />

          {/** Submit Button */}
          <div className="mt-10 text-left">
            <Button
              width="153px"
              height="45px"
              backgroundColor="white"
              title="Create Account"
              borderRadius="10px"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
