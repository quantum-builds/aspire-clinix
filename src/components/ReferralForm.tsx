"use client";
import FormInput from "@/components/ui/FormInput";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckboxInput from "@/components/ui/CheckboxInput";
import { useState } from "react";
import Button from "@/components/ui/Button";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  DOB: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of Birth must be in the format YYYY-MM-DD."
    ),
  address: z.string().min(6, "Address must be at least 6 characters long."),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  referralName: z
    .string()
    .min(3, "Referral's name must be at least 3 characters long."),
  referralGDC: z
    .string()
    .min(1, "Referral GDC must be provided (specify proper format)."),
  referralAddress: z
    .string()
    .min(6, "Referral's address must be at least 6 characters long."),
  referralMobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Referral's mobile number must be exactly 10 digits."),
  referralEmail: z
    .string()
    .email("Please enter a valid email address for the referral."),
  referralPassword: z
    .string()
    .min(6, "Referral's password must be at least 6 characters long."),
  checkboxes: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ReferralForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const options = [
    "Implants",
    "Periodontology",
    "Oral Surgery",
    "Dentures",
    "Root Canal",
    "Paediatric Dentistry",
    "Orthodontics",
    "Treatment planning & Advice",
  ];
  const newOptions = ["Yes", "No"];
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const handleOptionChange = (value: string) => {
    setSelectedOption((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="bg-[#ECE8E3] w-full py-16 font-opus my-10">
      <div className="max-w-[80%] mx-auto">
        <div className="my-5">
          <h1 className="text-[52px] font-normal">Referral Form</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[75%]">
          <h2 className="text-[32px] font-normal mt-10 mb-8">
            Patient Details
          </h2>
          <FormInput
            type="text"
            name="name"
            label="Name of Patient"
            control={control}
            errorMessage={errors.name?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="8px"
          />
          <FormInput
            type="date"
            name="DOB"
            label="Date of Birth"
            control={control}
            errorMessage={errors.DOB?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="8px"
          />
          <FormInput
            type="text"
            name="address"
            label="Address"
            control={control}
            errorMessage={errors.address?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="8px"
          />
          <div className="flex justify-between gap-8">
            <FormInput
              type="text"
              name="mobileNumber"
              label="Mobile Number"
              control={control}
              errorMessage={errors.mobileNumber?.message}
              className="flex-1"
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="8px"
            />
            <FormInput
              type="text"
              name="email"
              label="Email Address"
              control={control}
              errorMessage={errors.email?.message}
              className="flex-1"
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="8px"
            />
          </div>
          <div className="mt-6">
            <h2 className="text-[24px] font-normal">Medical History</h2>
          </div>
          <CheckboxInput
            options={options}
            name="root"
            selectedOption={selectedOption || []}
            onChange={handleOptionChange}
            title="Referral Details"
          />
          <div className="mt-5">
            <label htmlFor="other" className="text-[22px] font-normal">
              Other
            </label>
            <input
              type="text"
              name="other"
              id="other"
              className="ml-4 w-[334px] h-[55px] rounded-lg bg-[#ECE8E3] border border-black px-2 outline-none"
            />
          </div>
          <div className="mt-16">
            <label htmlFor="" className="text-[24px] font-normal block mb-4">
              Please describe the treatment required in as much detail as
              possible
            </label>
            <textarea
              name=""
              className="w-full h-[223px] bg-[#ECE8E3] border border-black rounded-lg p-4 outline-none"
            ></textarea>
          </div>
          <div className="mt-24">
            <h2 className="text-[32px] font-normal">
              Referring Dentist Details
            </h2>
            <FormInput
              type="text"
              name="referralName"
              label="Name of Dentist"
              control={control}
              errorMessage={errors.referralName?.message}
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="8px"
            />
            <FormInput
              type="text"
              name="referralGDC"
              label="GDC Number"
              control={control}
              errorMessage={errors.referralGDC?.message}
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="8px"
            />
            <FormInput
              type="text"
              name="referralAddress"
              label="Practice Name & Address"
              control={control}
              errorMessage={errors.referralAddress?.message}
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="8px"
            />
            <div className="flex justify-between gap-8">
              <FormInput
                type="text"
                name="referralMobileNumber"
                label="Practice Phone Number"
                control={control}
                errorMessage={errors.referralMobileNumber?.message}
                className="flex-1"
                backgroundColor="#ECE8E3"
                marginTop="50px"
                padding="8px"
              />
              <FormInput
                type="text"
                name="referralEmail"
                label="Practice Email Address"
                control={control}
                errorMessage={errors.referralEmail?.message}
                className="flex-1"
                backgroundColor="#ECE8E3"
                marginTop="50px"
                padding="8px"
              />
            </div>
            <div className="mt-6">
              <CheckboxInput
                options={newOptions}
                name="root"
                selectedOption={selectedOption}
                onChange={handleOptionChange}
                description="Would you like to attend the treatment appointment with the
                  patient and shadow the dentist?"
              />
            </div>
          </div>
          <div className="ml-8 mt-20">
            <Button
              width="232px"
              height="77px"
              backgroundColor="white"
              title="Submit Referral"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
