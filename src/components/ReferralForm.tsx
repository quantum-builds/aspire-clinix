"use client";
import FormInput from "@/components/ui/FormInput";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckboxInput } from "@/components/ui/CheckboxInput";
import Button from "@/components/ui/Button";
import { formSchema } from "@/schemas/referralFormSchema";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof formSchema>;

const REFERRAL_DETAIL = {
  name: "referralDetails",
  options: [
    { label: "Implants", value: "implants" },
    { label: "Periodontology", value: "periodontology" },
    { label: "Oral Surgery", value: "oralSurgery" },
    { label: "Dentures", value: "dentures" },
    { label: "Root Canal", value: "rootCanal" },
    { label: "Paediatric Dentistry", value: "paediatricDentistry" },
    { label: "Orthodontics", value: "orthodontics" },
    {
      label: "Treatment planning & Advice",
      value: "treatmentPlanningAndAdvice",
    },
  ],
};
const TREATMENT_APPOINTMENT = {
  name: "treatMeantAppointment",
  optionsDentist: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};

export default function ReferralForm() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      DOB: "",
      address: "",
      mobileNumber: "",
      email: "",
      referralName: "",
      referralGDC: "",
      referralAddress: "",
      referralMobileNumber: "",
      referralEmail: "",
      referralDetails: [],
      treatMeantAppointment: "",
      medicalHistory: "",
    },
  });

  const { mutate: submitForm } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post(
        ENDPOINTS.referralForm.create,
        data
      );
      return response.data;
    },
    onError: (error: AxiosError) => {
      console.error("Error:", error);
    },
    onSuccess: () => {
      router.push("/");
    },
    
  });
  const onSubmit = (data: FormData) => {
    submitForm(data);
  };

  return (
    <div className="bg-feeGuide w-full h-full py-16 font-opus flex justify-center items-center ">
      <div className="zoom-out max-w-[80%] mx-auto flex justify-center items-center flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[75%]">
          <h1 className="text-[40px] md:text-[52px] font-normal text-left">
            Referral Form
          </h1>
          <h2 className="text-[32px] font-normal mt-16 mb-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-between flex-1 gap-16">
            <FormInput
              type="text"
              name="mobileNumber"
              label="Mobile Number"
              control={control}
              errorMessage={errors.mobileNumber?.message}
              className="flex-1 w-full"
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
              className="flex-1 w-full"
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="8px"
            />
          </div>
          <div className="mt-6">
            <h2 className="text-[16px] md:text-[24px] font-normal">
              Medical History
            </h2>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
          <div>
            <h3 className="font-opus text-[16px] md:text-[24px]">
              Referral Details
            </h3>
            <div className="grid mt-4 justify-center items-start md:grid-cols-2 gap-1 lg:gap-2 lg:gap-x-20 min-w-max">
              {REFERRAL_DETAIL.options.map((option) => (
                <CheckboxInput
                  type="checkbox"
                  key={option.value}
                  name={REFERRAL_DETAIL.name}
                  label={option.label}
                  value={option.value}
                  control={control}
                />
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-center">
            <label
              htmlFor="other"
              className="text-[16px] md:text-[22px] font-normal"
            >
              Other
            </label>
            <Controller
              name="other"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  id="other"
                  className="ml-8 w-[200px] h-[40px] md:w-[334px] md:h-[55px] rounded-lg bg-feeGuide border border-black px-2 outline-none"
                />
              )}
            />
          </div>
          <div className="mt-16">
            <label
              htmlFor="treatmentDetails"
              className="text-[16] md:text-[24px] font-normal block mb-4"
            >
              Please describe the treatment required in as much detail as
              possible
            </label>
            <Controller
              name="treatmentDetails"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <textarea
                  {...field}
                  id="treatmentDetails"
                  className="w-full h-[223px] bg-feeGuide border border-black rounded-lg p-4 outline-none"
                />
              )}
            />
          </div>
          <div className="mt-24">
            <h2 className="text-[16px] md:text-[32px] font-normal">
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
            <div className="flex flex-wrap justify-between gap-16">
              <div className="flex flex-1 items-center">
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
              </div>
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
            <div className="mt-16">
              <p className="text-[16px] md:text-[24px] font-normal font-opus mb-4">
                Would you like to attend the treatment appointment with the
                patient and shadow the dentist?
              </p>
              <div className="grid justify-center items-start lg:gap-x-20 grid-cols-2 mt-3">
                  {TREATMENT_APPOINTMENT.optionsDentist.map((option) => (
                    <CheckboxInput
                      type="radio"
                      key={option.value}
                      name={TREATMENT_APPOINTMENT.name}
                      label={option.label}
                      value={option.value}
                      control={control}
                      radioName="name"
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className=" my-20 flex md:justify-start justify-center items-center md:items-start">
            <Button
              type="submit"
              title="Submit Referral"
              className="w-[150px] h-[50px] text-black bg-white rounded-[5px] md:rounded-[20px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
