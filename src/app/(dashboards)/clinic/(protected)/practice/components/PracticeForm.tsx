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
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { OpeningHours, TPracticeCreate } from "@/types/practice";
import { useCreatePractice } from "@/services/practice/practiceMutation";
import { showToast } from "@/utils/defaultToastOptions";
import { useRouter } from "next/navigation";
import { ResoucrceType } from "@prisma/client";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";

const practiceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z
    .string()
    .regex(
      /^(\+44\s?\d{2,4}\s?\d{3,4}\s?\d{3,4}|0\d{2,4}\s?\d{3,4}\s?\d{3,4})$/,
      "Please enter a valid UK phone number"
    )
    .refine(
      (val) => {
        const digitsOnly = val.replace(/\D/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      { message: "Phone number must be between 10 and 15 digits" }
    )
    .transform((val) => val.replace(/\s+/g, "")),

  postcode: z
    .string()
    .regex(
      /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      "Enter a valid UK postcode"
    ),
  timezone: z.literal("Europe/London").default("Europe/London"),
  town: z.string().min(1, "Town is required"),
  nhs: z.enum(["True", "False"], { required_error: "Select NHS option" }),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().min(1, "Address Line 2 is required"),
  daysAndHours: z
    .array(
      z.object({
        day: z.string().min(1, "Day is required"),
        opening: z.date({ required_error: "Opening hours required" }),
        closing: z.date({ required_error: "Closing hours  is required" }),
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
  const { mutateAsync: uploadFile, isPending: uplaodFileLoader } =
    useUploadFile();
  const { mutate: createPractice, isPending: createPracticeLoader } =
    useCreatePractice();
  const { replace } = useRouter();

  const open = new Date();
  open.setHours(9, 0, 0, 0);
  const close = new Date();
  close.setHours(17, 0, 0, 0);

  const defaultValues: FormData = {
    name: "",
    email: "",
    phoneNumber: "",
    postcode: "",
    timezone: "Europe/London",
    town: "",
    nhs: "True",
    address1: "",
    address2: "",
    daysAndHours: [{ day: "", opening: open, closing: close }],
    logo: undefined,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
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
  const selectedDays = watch("daysAndHours").map((d) => d.day);

  useEffect(() => {
    const hasChanges = Object.keys(values).some(
      (key) =>
        values[key as keyof FormData] !== defaultValues[key as keyof FormData]
    );
    setIsDirty(hasChanges);
  }, [values]);


  const onSubmit = async (data: FormData) => {
    console.log("Practice form submitted:", data);

    let fileUrl = undefined;
    if (data.logo instanceof File) {
      const imageUploaded = await uploadFile({
        selectedFile: data.logo,
        fileType: ResoucrceType.IMAGES,
      });

      fileUrl = `uploads/aspire-clinic/images/${imageUploaded.name}`;
    }

    const openingHours: OpeningHours = {};
    data.daysAndHours.forEach((item) => {
      openingHours[item.day as keyof OpeningHours] = {
        open: item.opening,
        close: item.closing,
      };
    });

    const payload: TPracticeCreate = {
      email: data.email,
      name: data.name,
      nhs: data.nhs === "True",
      openingHours: openingHours,
      addressLine1: data.address1,
      addressLine2: data.address2,
      phoneNumber: data.phoneNumber,
      postcode: data.postcode,
      timeZone: data.timezone,
      town: data.town,
      logoUrl: fileUrl,
    };

    createPractice(
      {
        practiceCreate: payload,
      },
      {
        onSuccess: () => {
          showToast("success", "Practice created successfully");
          replace(`/clinic/practice?ts=${Date.now()}`);
        },
        onError: (error) => {
          const msg = getAxiosErrorMessage(error);
          showToast("error", msg);
        },
      }
    );
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-y-hidden">
      <div className="bg-dashboardBarBackground rounded-2xl">
        {/* Section 1: Practice Form */}
        <div className="rounded-2xl p-6 space-y-10">
          <p className="text-2xl font-medium text-green">Practice Form</p>

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Name
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
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
              <Label className="text-lg font-medium">Email
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
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
              <Label className="text-lg font-medium">Phone Number
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    type="tel"
                    {...field}
                    placeholder="e.g. 01632960001, +44 20 7946 0056"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Postcode */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Postcode
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="postcode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g SW1A 1AA"
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
              <Label className="text-lg font-medium">Time Zone
              </Label>
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled
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
              <Label className="text-lg font-medium">Town
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
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
              <Label className="text-lg font-medium">NHS Contracted Practice
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="nhs"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2 col-span-2">
                    <Controller
                      name="nhs"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          options={[
                            { value: "True", label: "Yes, NHS Contracted" },
                            { value: "False", label: "No, Private Practice" },
                          ]}
                          value={field.value}
                          onValueChange={(val) => field.onChange(val || "")}
                          placeholder="Select NHS option"
                          className="w-full"
                          contentClassName="w-full"
                          triggerClassName="bg-gray px-6 py-3 h-[52px] rounded-2xl justify-between"
                          placeholderClassName="text-gray-600"
                          showClearOption={true}
                        />
                      )}
                    />

                    {errors.nhs && (
                      <p className="text-sm text-red-500">{errors.nhs.message}</p>
                    )}
                  </div>

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
              <Label className="text-lg font-medium">Address Line 1
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
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
              <Label className="text-lg font-medium">Address Line 2
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
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
              onClick={() => {
                if (fields.length >= 7) {
                  showToast("error", "You can only add up to 7 days");
                  return;
                }
                const open = new Date();
                open.setHours(9, 0, 0, 0);
                const close = new Date();
                close.setHours(17, 0, 0, 0);
                append({ day: "", opening: open, closing: close });
              }}
              className="text-green font-medium"
            >
              + Add New
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-6 items-start">
                {/* Day dropdown */}
                <div className="space-y-2">
                  {index === 0 && (
                    <Label className="text-lg font-medium">
                      Choose Day
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </Label>
                  )}
                  <Controller
                    name={`daysAndHours.${index}.day`}
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        options={daysOfWeek.map((day) => {
                          const isSelectedElsewhere = selectedDays.includes(day);
                          const isCurrent = field.value === day;
                          return {
                            value: day,
                            label: day,
                            disabled: isSelectedElsewhere && !isCurrent,
                          };
                        })}
                        value={field.value}
                        onValueChange={(val) => field.onChange(val || "")}
                        placeholder="Select day"
                        className="w-full"
                        triggerClassName="bg-gray px-6 py-3 h-[52px] rounded-2xl justify-between"
                        placeholderClassName="text-gray-600"
                        showClearOption={true}
                        contentClassName="w-full"
                      />
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
                  {/* Opening Time */}
                  <div className="space-y-2">
                    {index === 0 && (
                      <Label className="text-lg font-medium">Opening Hours</Label>
                    )}
                    <div className="relative">
                      <Controller
                        name={`daysAndHours.${index}.opening`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="time"
                            value={field.value ? formatTimeForInput(field.value) : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(":").map(Number);
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

                  {/* Closing Time */}
                  <div className="space-y-2">
                    {index === 0 && (
                      <Label className="text-lg font-medium">Closing Hours</Label>
                    )}
                    <div className="relative">
                      <Controller
                        name={`daysAndHours.${index}.closing`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="time"
                            value={field.value ? formatTimeForInput(field.value) : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(":").map(Number);
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
            style="secondary"
            text={"Cancel"}
            handleOnClick={() => reset()}
            className="py-3 px-6 h-[60px]"
          />
          <CustomButton
            style="primary"
            text={
              createPracticeLoader || uplaodFileLoader
                ? "Saving Changes..."
                : "Save Changes"
            }
            type="submit"
            loading={createPracticeLoader || uplaodFileLoader}
            className="py-3 px-6 h-[60px]"
          />
        </div>
      )}
    </form>
  );
}
