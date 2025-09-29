"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { CalenderInputIcon, TextInputIcon, TimeIcon } from "@/assets";
import { cn } from "@/lib/utils";

const assignDentistSchema = z.object({
  dentist: z.string().min(1, "Please select a dentist"),
  branch: z.string().min(1, "Please select a branch"),
  dentistName: z.string().min(2, "Enter dentist name"),
  gdcNo: z.string().min(1, "Enter GDC number"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  appointmentDate: z.date({ required_error: "Appointment date is required" }),
  startTime: z.string().min(1, "Enter start time"),
  endTime: z.string().min(1, "Enter end time"),
});

type FormData = z.infer<typeof assignDentistSchema>;

const dentists = [
  { value: "dentist1", label: "Dr. John Doe" },
  { value: "dentist2", label: "Dr. Jane Smith" },
];

const branches = [
  { value: "branch1", label: "Downtown Clinic" },
  { value: "branch2", label: "Uptown Clinic" },
];

export default function AssignDentistForm() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultValues = {
    dentist: "",
    branch: "",
    dentistName: "",
    gdcNo: "",
    phone: "",
    email: "",
    appointmentDate: new Date(),
    startTime: "",
    endTime: "",
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(assignDentistSchema),
    defaultValues: defaultValues,
  });

  const values = watch();
  useEffect(() => {
    const hasChanges = Object.keys(values).some(
      (key) =>
        values[key as keyof FormData] !== defaultValues[key as keyof FormData]
    );
    setIsDirty(hasChanges);
  }, [values, defaultValues]);

  const onSubmit = (data: FormData) => {
    console.log("Assign Dentist Form:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* White box with form fields */}
      <div className="bg-white rounded-2xl p-6 space-y-10">
        <div>
          <p className="text-2xl font-medium">Assign Details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dentist */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">Dentist</Label>
            <Controller
              name="dentist"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                    <SelectValue placeholder="Select Dentist" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentists.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.dentist && (
              <p className="text-sm text-red-500">{errors.dentist.message}</p>
            )}
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">Branch</Label>
            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.branch && (
              <p className="text-sm text-red-500">{errors.branch.message}</p>
            )}
          </div>
        </div>

        {/* Dentist Name & GDC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Dentist Name</Label>
            <Controller
              name="dentistName"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter dentist name"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                  <Image
                    src={TextInputIcon}
                    alt="text-input"
                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              )}
            />
            {errors.dentistName && (
              <p className="text-sm text-red-500">
                {errors.dentistName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-medium">GDC No.</Label>
            <Controller
              name="gdcNo"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter GDC number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                  <Image
                    src={TextInputIcon}
                    alt="text-input"
                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              )}
            />
            {errors.gdcNo && (
              <p className="text-sm text-red-500">{errors.gdcNo.message}</p>
            )}
          </div>
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Phone</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter phone number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                  <Image
                    src={TextInputIcon}
                    alt="text-input"
                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              )}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-medium">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter email address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                  <Image
                    src={TextInputIcon}
                    alt="text-input"
                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Appointment Date, Start Time, End Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">Appointment Date</Label>
            <Controller
              name="appointmentDate"
              control={control}
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "relative w-full text-left font-normal bg-gray px-6 py-3 h-[52px] rounded-2xl",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span className="mr-auto">
                          {field.value.toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="mr-auto">Select date</span>
                      )}
                      <Image
                        src={CalenderInputIcon}
                        alt="calender-input"
                        className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => date && field.onChange(date)}
                      disabled={(date) =>
                        date < new Date("1900-01-01") || date > new Date()
                      }
                      captionLayout="dropdown"
                      showOutsideDays={false}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.appointmentDate && (
              <p className="text-sm text-red-500">
                {errors.appointmentDate.message}
              </p>
            )}
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-lg font-medium">Start Time</Label>
              <div className="relative">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      placeholder="Enter start time"
                      className="bg-gray px-6 py-3 h-[52px] rounded-2xl pr-12 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  )}
                />
                <Image
                  src={TimeIcon}
                  alt="time-icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                />
              </div>
              {errors.startTime && (
                <p className="text-sm text-red-500">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium">End Time</Label>
              <div className="relative">
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      className="bg-gray px-6 py-3 h-[52px] rounded-2xl pr-12 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  )}
                />
                <Image
                  src={TimeIcon}
                  alt="time-icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                />
              </div>
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDirty && (
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            type="submit"
            className="text-[#A3A3A3] bg-transparent shadow-none hover:bg-transparent font-medium text-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-[60px] w-fit px-6 py-3 font-medium text-xl text-dashboardBarBackground bg-green hover:bg-green flex items-center justify-center gap-2 rounded-[100px]"
          >
            Assign Patient
          </Button>
        </div>
      )}
    </form>
  );
}
