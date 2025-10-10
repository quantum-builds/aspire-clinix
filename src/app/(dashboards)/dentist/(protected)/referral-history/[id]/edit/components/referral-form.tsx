"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalenderGreenIcon, TextInputIcon, UploadPDFIcon } from "@/assets";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const profileFormSchema = z.object({
  // Patient
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number"
    )
    .refine(
      (val) => {
        const digitsOnly = val.replace(/\s+/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      { message: "Phone number must be between 10 and 15 digits" }
    )
    .transform((val) => val.replace(/\s+/g, "")),
  dateOfBirth: z.date({
    required_error: "Date of Birth is required",
    invalid_type_error: "Invalid date",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  medicalHistoryFile: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File must be less than 5MB"
    )
    .refine((file) => file.type === "application/pdf", "Only PDF allowed")
    .optional(),
  // referral
  referralTreatment: z.string().optional(),
  otherReferral: z.string().optional(),
  treatmentDescription: z
    .string()
    .min(10, "Please provide at least 10 characters"),

  // Dentist
  dentistName: z.string().min(2, "Name must be at least 2 characters"),
  dentistGdc: z.string().min(2, "GDC No. is required"),
  dentistPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  dentistEmail: z.string().email("Please enter a valid email address"),
  dentistAddress: z.string().min(5, "Address must be at least 5 characters"),
  attendTreatment: z.enum(["yes", "no"], {
    required_error: "Please select an option",
  }),
});

type FormData = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<FormData> = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: undefined,
  address: "",
  medicalHistoryFile: undefined,
  referralTreatment: "",
  otherReferral: "",
  treatmentDescription: "",
  dentistName: "",
  dentistGdc: "",
  dentistPhone: "",
  dentistEmail: "",
  dentistAddress: "",
  attendTreatment: undefined,
};

export default function ReferralForm() {
  const [hasChanges, setHasChanges] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const watchedValues = watch();

  useEffect(() => {
    setHasChanges(
      JSON.stringify(watchedValues) !== JSON.stringify(defaultValues)
    );
  }, [watchedValues]);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setHasChanges(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setHasChanges(false);
  };

  const referralOptions = [
    "Implants",
    "Root Canal",
    "Periodontology",
    "Paediatric Dentistry",
    "Oral Surgery",
    "Orthodontics",
    "Dentures",
    "Treatment Planning & Advice",
  ];

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>
      {/* Patient Section */}
      <div className="bg-dashboardBarBackground rounded-2xl p-6 space-y-[100px]">
        <div className="grid grid-cols-3 gap-6 space-y-5">
          <p className="font-medium text-2xl text-green col-span-3">
            Patient Details
          </p>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-lg font-medium">
              Name of Patient<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="fullName"
                    placeholder="Enter patient name"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-medium">
              Email<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-lg font-medium">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g. +44 7123 456 789"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-lg font-medium">
              Date of Birth<span className="text-red-500">*</span>
            </Label>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Popover modal={false}>
                  <PopoverTrigger className="w-full relative">
                    <input
                      id="dateOfBirth"
                      type="text"
                      readOnly
                      value={field.value ? field.value.toDateString() : ""}
                      placeholder="Select Date"
                      className="bg-gray px-6 py-3 h-[52px] w-full rounded-2xl border text-left"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex justify-center items-center">
                      <Image
                        src={CalenderGreenIcon}
                        alt="calendar"
                        className="w-5 h-5"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" sideOffset={10} align="end">
                    <Calendar
                      mode="single"
                      disabled={{ after: new Date() }}
                      selected={field.value}
                      onSelect={field.onChange}
                      showOutsideDays={false}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="address" className="text-lg font-medium">
              Address<span className="text-red-500">*</span>
            </Label>
            <div className="relative w-full">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="address"
                    placeholder="Enter address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl w-full"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <p className="font-medium text-2xl text-green col-span-3">
            Medical History
          </p>

          <div className="space-y-2 flex gap-5 items-center">
            <Controller
              name="medicalHistoryFile"
              control={control}
              render={({ field }) => (
                <>
                  {/* Hidden file input */}
                  <input
                    id="medicalHistory"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                    }}
                  />

                  <label
                    htmlFor="medicalHistory"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Image src={UploadPDFIcon} alt="Upload file" />
                    <p className="text-green underline">Upload a document</p>
                  </label>
                </>
              )}
            />
            {errors.medicalHistoryFile && (
              <p className="text-sm text-red-500">
                {errors.medicalHistoryFile.message}
              </p>
            )}
          </div>
        </div>

        <div className="h-[2px] bg-gray" />

        <div className="space-y-7">
          <p className="font-medium text-2xl text-green">Referral Details</p>

          {/* Radio grid */}
          <div className="grid grid-cols-2 gap-4 max-w-[640px]">
            {referralOptions.map((option) => (
              <Controller
                key={option}
                name="referralTreatment"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-5 cursor-pointer text-xl">
                    <input
                      type="radio"
                      value={option}
                      checked={field.value === option}
                      onChange={() => field.onChange(option)}
                      className="appearance-none size-5 bg-gray rounded-sm
                                 checked:bg-green"
                    />
                    <span>{option}</span>
                  </label>
                )}
              />
            ))}
          </div>
          {errors.referralTreatment && (
            <p className="text-sm text-red-500">
              {errors.referralTreatment.message}
            </p>
          )}

          {/* Other input inline */}
          <div className="flex items-center gap-5 max-w-[612px]">
            <Label htmlFor="otherReferral" className="text-lg font-medium">
              Other
            </Label>
            <Controller
              name="otherReferral"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="otherReferral"
                  disabled={!!watchedValues.referralTreatment}
                  className="border border-green px-6 py-3 h-[52px] rounded-2xl flex-1"
                />
              )}
            />
          </div>
          {errors.otherReferral && (
            <p className="text-sm text-red-500">
              {errors.otherReferral.message}
            </p>
          )}

          {/* Textarea */}
          <div className="space-y-3">
            <Label htmlFor="treatmentDescription" className="text-xl">
              Please describe the treatment required in as many detail as
              possible.
            </Label>
            <Controller
              name="treatmentDescription"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="treatmentDescription"
                  placeholder="Please write your description here..."
                  className="border border-green px-6 py-3 h-[200px] rounded-2xl w-full outline-none"
                />
              )}
            />
            {errors.treatmentDescription && (
              <p className="text-sm text-red-500">
                {errors.treatmentDescription.message}
              </p>
            )}
          </div>
        </div>

        <div className="h-[2px] bg-gray" />

        {/* Dentist Section */}
        <div className="grid grid-cols-3 gap-6 space-y-5">
          <p className="font-medium text-2xl text-green col-span-3">
            Referral Dentist Details
          </p>

          {/* Dentist Name */}
          <div className="space-y-2">
            <Label htmlFor="dentistName" className="text-lg font-medium">
              Name of Dentist<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="dentistName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dentistName"
                    placeholder="Enter full name"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.dentistName && (
              <p className="text-sm text-red-500">
                {errors.dentistName.message}
              </p>
            )}
          </div>

          {/* GDC */}
          <div className="space-y-2">
            <Label htmlFor="dentistGdc" className="text-lg font-medium">
              GDC No.<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="dentistGdc"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dentistGdc"
                    placeholder="Enter GDC number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.dentistGdc && (
              <p className="text-sm text-red-500">
                {errors.dentistGdc.message}
              </p>
            )}
          </div>

          {/* Dentist Phone */}
          <div className="space-y-2">
            <Label htmlFor="dentistPhone" className="text-lg font-medium">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="dentistPhone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dentistPhone"
                    placeholder="Enter phone number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.dentistPhone && (
              <p className="text-sm text-red-500">
                {errors.dentistPhone.message}
              </p>
            )}
          </div>

          {/* Dentist Email */}
          <div className="space-y-2">
            <Label htmlFor="dentistEmail" className="text-lg font-medium">
              Practice Email<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                name="dentistEmail"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dentistEmail"
                    type="email"
                    placeholder="Enter email address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.dentistEmail && (
              <p className="text-sm text-red-500">
                {errors.dentistEmail.message}
              </p>
            )}
          </div>

          {/* Dentist Address */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="dentistAddress" className="text-lg font-medium">
              Practice Address<span className="text-red-500">*</span>
            </Label>
            <div className="relative w-full">
              <Controller
                name="dentistAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dentistAddress"
                    placeholder="Enter practice address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl w-full"
                  />
                )}
              />
              <Image
                src={TextInputIcon}
                alt="icon"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
            {errors.dentistAddress && (
              <p className="text-sm text-red-500">
                {errors.dentistAddress.message}
              </p>
            )}
          </div>

          {/* Attend Treatment */}
          <div className="space-y-7 col-span-3 ">
            <Label className="text-2xl font-medium">
              Would you like to attend the treatment appointment with the
              patient and shadow the dentist?
            </Label>
            <Controller
              name="attendTreatment"
              control={control}
              render={({ field }) => (
                <div className="flex gap-[100px]">
                  <label className="flex items-center gap-5">
                    <input
                      type="radio"
                      value="yes"
                      checked={field.value === "yes"}
                      onChange={field.onChange}
                      className="bg-gray size-5 rounded-md cursor-pointer appearance-none "
                    />
                    <span className="text-xl">Yes</span>
                  </label>
                  <label className="flex items-center gap-5">
                    <input
                      type="radio"
                      value="no"
                      checked={field.value === "no"}
                      onChange={field.onChange}
                      className="bg-gray size-5 appearance-none  rounded-md cursor-pointer"
                    />
                    <span className="text-xl">No</span>
                  </label>
                </div>
              )}
            />
            {errors.attendTreatment && (
              <p className="text-sm text-red-500">
                {errors.attendTreatment.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            className="text-[#A3A3A3] bg-transparent shadow-none hover:bg-transparent font-medium text-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-green flex items-center justify-center gap-2 rounded-[100px]"
          >
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
