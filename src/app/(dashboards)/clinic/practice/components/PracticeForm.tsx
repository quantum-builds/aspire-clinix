"use client";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { formatTimeForInput } from "@/utils/formatDateTime";
import Image from "next/image";
import { TimeIconV2, UploadImageIconV2 } from "@/assets";

const practiceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(1, "Phone is required"),
  postcode: z.string().min(1, "Postcode is required"),
  timezone: z.string().min(1, "Time zone is required"),
  town: z.string().min(1, "Town is required"),
  nhs: z.enum(["True", "False"], { required_error: "Select NHS option" }),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().optional(),
  daysAndHours: z
    .array(
      z.object({
        day: z.string().min(1, "Day is required"),
        opening: z.string().min(1, "Opening hours required"),
        closing: z.string().min(1, "Closing hours required"),
      })
    )
    .min(1, "At least one day & hours entry is required"),
  logo: z
    .any()
    .refine((file) => !file || file instanceof File, {
      message: "Please upload a valid image",
    })
    .refine(
      (file) =>
        !file ||
        (file.type?.startsWith("image/") && file.size <= 5 * 1024 * 1024),
      { message: "Only image files under 5MB are allowed" }
    )
    .optional(),
});

type FormData = z.infer<typeof practiceFormSchema>;

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PracticeForm() {
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const defaultValues: FormData = {
    name: "",
    email: "",
    phone: "",
    postcode: "",
    timezone: "",
    town: "",
    nhs: "True",
    address1: "",
    address2: "",
    daysAndHours: [{ day: "", opening: "", closing: "" }],
    logo: undefined,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    control,
    name: "daysAndHours",
  });

  const values = watch();
  useEffect(() => {
    const hasChanges = Object.keys(values).some(
      (key) =>
        values[key as keyof FormData] !== defaultValues[key as keyof FormData]
    );
    setIsDirty(hasChanges);
  }, [values]);

  const onSubmit = (data: FormData) => {
    console.log("Practice form submitted:", data);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file?: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (logoPreview) URL.revokeObjectURL(logoPreview); // cleanup old preview
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      onChange(file);
      setValue("logo", file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-dashboardBarBackground rounded-2xl">
        {/* Section 1: Practice Form */}
        <div className="rounded-2xl p-6 space-y-10">
          <p className="text-2xl font-medium text-green">Practice Form</p>

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter name"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter email address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Phone</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter phone number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Postcode */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Postcode</Label>
              <Controller
                name="postcode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter postcode"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.postcode && (
                <p className="text-sm text-red-500">
                  {errors.postcode.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-4 gap-6">
            {/* Timezone */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Time Zone</Label>
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter time zone"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl mb-4"
                  />
                )}
              />
              {errors.timezone && (
                <p className="text-sm text-red-500">
                  {errors.timezone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-medium">Town</Label>
              <Controller
                name="town"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter town"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.town && (
                <p className="text-sm text-red-500">{errors.town.message}</p>
              )}
            </div>

            {/* NHS Dropdown */}
            <div className="space-y-2 col-span-2">
              <Label className="text-lg font-medium">NHS</Label>
              <Controller
                name="nhs"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                      <SelectValue placeholder="Enter NHS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="True">True</SelectItem>
                      <SelectItem value="False">False</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.nhs && (
                <p className="text-sm text-red-500">{errors.nhs.message}</p>
              )}
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Address 1 */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Address Line 1</Label>
              <Controller
                name="address1"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.address1 && (
                <p className="text-sm text-red-500">
                  {errors.address1.message}
                </p>
              )}
            </div>

            {/* Address 2 */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Address Line 2</Label>
              <Controller
                name="address2"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.address2 && (
                <p className="text-sm text-red-500">
                  {errors.address2.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Days & Hours */}
        <div className="bg-white rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-medium text-green">
              Days & Hours Details
            </p>
            <button
              type="button"
              onClick={() => append({ day: "", opening: "", closing: "" })}
              className="text-green font-medium"
            >
              + Add New
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 gap-6 items-start"
              >
                {/* Day dropdown */}
                <div className="space-y-2">
                  <Label className="text-lg font-medium">Choose Day</Label>
                  <Controller
                    name={`daysAndHours.${index}.day`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.daysAndHours?.[index]?.day && (
                    <p className="text-sm text-red-500">
                      {errors.daysAndHours[index]?.day?.message}
                    </p>
                  )}
                </div>

                {/* Opening & Closing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Opening Hours</Label>
                    <div className="relative">
                      <Controller
                        name={`daysAndHours.${index}.opening`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="time"
                            value={
                              field.value ? formatTimeForInput(field.value) : ""
                            }
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const newDate = new Date();
                              newDate.setHours(hours);
                              newDate.setMinutes(minutes);
                              field.onChange(newDate);
                            }}
                            className="bg-gray px-6 py-3 h-[52px] rounded-2xl pr-12 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                          />
                        )}
                      />
                      <Image
                        src={TimeIconV2}
                        alt="time-icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                      />
                    </div>
                    {errors.daysAndHours?.[index]?.opening && (
                      <p className="text-sm text-red-500">
                        {errors.daysAndHours[index]?.opening?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Closing Hours</Label>
                    <div className="relative">
                      <Controller
                        name={`daysAndHours.${index}.closing`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="time"
                            value={
                              field.value ? formatTimeForInput(field.value) : ""
                            }
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const newDate = new Date();
                              newDate.setHours(hours);
                              newDate.setMinutes(minutes);
                              field.onChange(newDate);
                            }}
                            className="bg-gray px-6 py-3 h-[52px] rounded-2xl pr-12 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                          />
                        )}
                      />
                      <Image
                        src={TimeIconV2}
                        alt="time-icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                      />
                    </div>
                    {errors.daysAndHours?.[index]?.closing && (
                      <p className="text-sm text-red-500">
                        {errors.daysAndHours[index]?.closing?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Upload Logo */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            {/* Preview box */}
            <div className="w-16 h-16 rounded-lg bg-gray flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={UploadImageIconV2}
                  alt="upload"
                  className="w-6 h-6 opacity-50"
                />
              )}
            </div>

            {/* Underline text */}
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, field.onChange)}
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="text-green underline font-medium"
                  >
                    Upload Logo
                  </button>
                </>
              )}
            />
          </div>
          {errors.logo && (
            <p className="text-sm text-red-500">
              {errors.logo.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      {isDirty && (
        <div className="w-full flex justify-end items-center gap-3">
          <CustomButton
            className="text-[#A3A3A3] bg-transparent shadow-none hover:bg-transparent font-medium text-xl"
            text="Cancel"
          />

          <CustomButton
            text="Save Practice"
            className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-green flex items-center justify-center gap-2 rounded-[100px]"
          />
        </div>
      )}
    </form>
  );
}
