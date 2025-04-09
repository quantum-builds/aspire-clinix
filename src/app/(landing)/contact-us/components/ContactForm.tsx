"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInput from "@/components/ui/FormInput";
import { CheckboxInput } from "@/components/ui/CheckboxInput";
import { image1 } from "@/assets";
import Image from "next/image";
import Button from "@/components/ui/CustomButton";

// Schema validation using zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, "Invalid phone number")
    .min(7, "Phone number must be at least 7 digits"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
  hearAboutUs: z.string().min(1, "Please select an option"), // Enforcing selection
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

const HEAR_ABOUT_US = {
  name: "hearAboutUs",
  optionsSource: [
    { label: "Internet Search ", value: "internet search" },
    { label: "Friend, Family Member", value: "friend, family member" },
    { label: "Social Media", value: "social media" },
    { label: "Other", value: "other" },
  ],
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      message: "",
      hearAboutUS: "",
      terms: false,
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="bg-feeGuide min-h-screen items-center lg:flex-row">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:w-1/2 mx-auto p-4 lg:p-14  bg-feeGuide "
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-between flex-1 gap-4">
          <FormInput
            type="text"
            name="firstName"
            label="First Name"
            control={control}
            errorMessage={errors.firstName?.message}
            className="flex-1 w-full "
            backgroundColor="#ECE8E3"
            marginTop="40px"
            padding="12px"
          />
          <FormInput
            type="text"
            name="lastName"
            label="Last Name"
            control={control}
            errorMessage={errors.lastName?.message}
            className="flex-1 w-full"
            backgroundColor="#ECE8E3"
            marginTop="40px"
            padding="12px"
          />
          <FormInput
            type="text"
            name="phoneNumber"
            label="Phone Number"
            control={control}
            errorMessage={errors.phoneNumber?.message}
            className="flex-1 w-full"
            backgroundColor="#ECE8E3"
            marginTop="30px"
            padding="12px"
          />
          <FormInput
            type="text"
            name="email"
            label="Email"
            control={control}
            errorMessage={errors.email?.message}
            className="flex-1 w-full"
            backgroundColor="#ECE8E3"
            marginTop="30px"
            padding="12px"
          />
        </div>
        <div className="mt-10">
          <label
            htmlFor="message"
            className="text-[16] md:text-[24px] font-normal block mb-4 font-opus"
          >
            Message
          </label>
          <Controller
            name="message"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <textarea
                {...field}
                id="message"
                className="w-full h-[223px] bg-feeGuide border border-black rounded-lg p-4 outline-none"
              />
            )}
          />
        </div>
        <div className="mt-10">
          <p className="text-[16px] md:text-[24px] font-normal font-opus mb-4">
            How did you hear about us
          </p>
          <div className="xl:grid flex flex-col justify-center items-start lg:gap-x-20 grid-cols-2 mt-3 font-opus">
            {HEAR_ABOUT_US.optionsSource.map((option) => (
              <CheckboxInput
                type="radio"
                key={option.value}
                name={HEAR_ABOUT_US.name}
                label={option.label}
                value={option.value}
                control={control}
                radioName="hearAboutUS"
              />
            ))}
          </div>
          {errors.hearAboutUS && (
            <p className="text-red-500 text-sm mt-2">
              {errors.hearAboutUS.message}
            </p>
          )}
        </div>

        <div className="mt-8 font-opus">
          <CheckboxInput
            type="checkbox"
            key="terms"
            name="terms"
            label={
              " I’ve read Aspire Clinic’s Privacy Policy and agree to the Terms & Conditions"
            }
            value={"false"}
            control={control}
          />
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm mt-2">{errors.terms.message}</p>
        )}

        <div className=" my-10 flex md:justify-end justify-center items-center md:items-start">
          <Button
            type="submit"
            title="Create Account"
            className="w-[180px] h-[60px] text-black bg-white rounded-[5px] md:rounded-lg text-lg font-opus"
          />
        </div>
      </form>
    </div>
  );
}
