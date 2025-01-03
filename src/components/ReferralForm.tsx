"use client";
import FormInput from "@/components/ui/FormInput";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckboxInput } from "@/components/ui/CheckboxInput";
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
  other: z.string().optional(),
  treatmentDetails: z.string().optional(),
  referralDetails: z.array(z.string()).optional(),
  treatMeantAppointment: z.string().optional(),
});

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
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    console.log("Form Errors: ", errors);
  };

  return (
    <div className="bg-[#ECE8E3] w-full  h-full py-16 font-opus ">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-between flex-1 gap-8">
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
            <div className="grid mt-4 justify-center items-start md:grid-cols-2 gap-2 min-w-max">
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
                  className="ml-8 w-[200px] h-[40px] md:w-[334px] md:h-[55px] rounded-lg bg-[#ECE8E3] border border-black px-2 outline-none"
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
                  className="w-full h-[223px] bg-[#ECE8E3] border border-black rounded-lg p-4 outline-none"
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
            <div className="flex flex-wrap justify-between gap-8">
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
              <div className="grid justify-center items-start grid-cols-2 mt-3">
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
          <div className="ml-8 mt-20">
            <Button
              type="submit"
              title="Submit Referral"
              className="w-[150px] h-[50px] text-black bg-white"
              // onClick={() => console.log("button clicked")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
