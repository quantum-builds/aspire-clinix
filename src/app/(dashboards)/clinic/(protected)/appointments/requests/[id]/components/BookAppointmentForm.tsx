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
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { TPractice } from "@/types/practice";
import { TDentist } from "@/types/dentist";
import { useCreateAppointment } from "@/services/appointments/appointmentMutation";
import { TAppointmentCreate } from "@/types/appointment";
import { TAppointmentRequest } from "@/types/appointment-request";
import { AppointmentRequestStatus, AppointmentStatus } from "@prisma/client";
import { formatTimeForInput } from "@/utils/formatDateTime";
import { usePatchAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestMutation";
import Spinner from "@/app/(dashboards)/components/custom-components/Spinner";

const assignDentistSchema = z.object({
  dentistName: z.string().min(2, "Enter dentist name"),
  dentistEmail: z.string().email("Please enter a valid email address"),
  gdcNo: z.string().min(1, "Enter GDC number"),
  practicAddress: z.string().min(1, "Please select a practice"),
  appointmentDate: z.date({ required_error: "Appointment date is required" }),
  startTime: z.date({ required_error: "Start time is required" }),
  finishTime: z.date({ required_error: "Finish time is required" }),
});

type FormData = z.infer<typeof assignDentistSchema>;

interface BookAppointmentFormProps {
  practices: TPractice[];
  dentists: TDentist[];
  appointmentRequest: TAppointmentRequest;
}

export default function BookAppointmentForm({
  practices,
  dentists,
  appointmentRequest,
}: BookAppointmentFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { mutate: createAppointment, isPending: createAppointmentLoader } =
    useCreateAppointment();
  const {
    mutate: updateAppointmentRequest,
    isPending: updateAppointmentRequestLoader,
  } = usePatchAppointmentRequest();
  const [isDirty, setIsDirty] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const defaultValues = {
    dentistName: "",
    dentistEmail: "",
    gdcNo: "",
    practicAddress: "",
    appointmentDate: new Date(),
    startTime: new Date(),
    finishTime: new Date(),
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
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
    const selectedDentist = dentists.find(
      (d) => d.fullName === data.dentistName
    );
    const newAppointment: TAppointmentCreate = {
      patientId: appointmentRequest?.patient?.id ?? "",
      dentistId: selectedDentist?.id ?? "",
      practiceId: data.practicAddress,
      reason: appointmentRequest.reason,
      state: AppointmentStatus.PENDING,
      date: data.appointmentDate,
      startTime: data.startTime,
      finishTime: data.finishTime,
    };
    createAppointment(
      { appointment: newAppointment },
      {
        onSuccess: () => {
          const partialAppointmentRequest: Partial<TAppointmentRequest> = {
            status: AppointmentRequestStatus.APPROVED,
          };
          updateAppointmentRequest(
            {
              id: appointmentRequest.id,
              appointmentRequest: partialAppointmentRequest,
            },
            {
              onSuccess: (data) => {
                console.log("data on success,", data);
                // router.refresh();
                // router.back();
                router.replace(
                  `/clinic/appointments/requests?ts=${Date.now()}`
                );
              },
            }
          );
        },
      }
    );
  };

  const handlePracticeChange = (practiceId: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("practiceId", practiceId);
    router.replace(`${pathname}?${params.toString()}`);
    setValue("practicAddress", practiceId);
  };

  // when dentist is selected, autofill email and gdc
  const handleDentistChange = (dentistName: string) => {
    setValue("dentistName", dentistName);

    const selectedDentist = dentists.find((d) => d.fullName === dentistName);
    if (selectedDentist) {
      setValue("dentistEmail", selectedDentist.email);
      setValue("gdcNo", selectedDentist.gdcNo);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* White box with form fields */}
      <div className="bg-white rounded-2xl p-6 space-y-10">
        <div>
          <p className="text-2xl font-medium">Book an Appointment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dentist */}
          {/* <div className="space-y-2">
            <Label className="text-lg font-medium">Dentist</Label>
            <Controller
              name="dentistName"
              control={control}
              render={({ field }) => (
                <Select onValueChange={handleDentistChange} value={field.value}>
                  <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                    <SelectValue placeholder="Select Dentist Name" />
                  </SelectTrigger>
                  {dentists && dentists.length > 0 && (
                    <SelectContent>
                      {dentists.map((d) => (
                        <SelectItem key={d.id} value={d.fullName}>
                          {d.fullName} - {d.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
              )}
            />
            {errors.dentistName && (
              <p className="text-sm text-red-500">
                {errors.dentistName.message}
              </p>
            )}
          </div> */}

          {/* Branch */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">Branch</Label>
            <Controller
              name="practicAddress"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={handlePracticeChange}
                  value={field.value}
                >
                  <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  {practices && practices.length > 0 && (
                    <SelectContent>
                      {practices.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.addressLine1}, {b.addressLine2}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
              )}
            />
          </div>

          {/* Dentist */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">Dentist</Label>
            <Controller
              name="dentistName"
              control={control}
              render={({ field }) => {
                const selectedPracticeId = watch("practicAddress");

                return (
                  <Select
                    onValueChange={handleDentistChange}
                    value={field.value}
                    disabled={!selectedPracticeId} // disable until branch selected
                  >
                    <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                      <SelectValue
                        placeholder={
                          !selectedPracticeId
                            ? "Select a branch first"
                            : dentists.length > 0
                            ? "Select Dentist Name"
                            : "No dentists available in this branch"
                        }
                      />
                    </SelectTrigger>
                    {selectedPracticeId && dentists.length > 0 && (
                      <SelectContent>
                        {dentists.map((d) => (
                          <SelectItem key={d.id} value={d.fullName}>
                            {d.fullName} - {d.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                );
              }}
            />
            {errors.dentistName && (
              <p className="text-sm text-red-500">
                {errors.dentistName.message}
              </p>
            )}
          </div>
        </div>

        {/*GDC & branch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    readOnly
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

          {/* {Email} */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">Email</Label>
            <Controller
              name="dentistEmail"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter email address"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                    readOnly
                  />
                  <Image
                    src={TextInputIcon}
                    alt="text-input"
                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              )}
            />
            {errors.dentistEmail && (
              <p className="text-sm text-red-500">
                {errors.dentistEmail.message}
              </p>
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
                      disabled={(date) => date < new Date()}
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
                      value={field.value ? formatTimeForInput(field.value) : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const newDate = new Date();
                        newDate.setHours(hours);
                        newDate.setMinutes(minutes);
                        field.onChange(newDate);
                      }}
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
                  name="finishTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      value={field.value ? formatTimeForInput(field.value) : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const newDate = new Date();
                        newDate.setHours(hours);
                        newDate.setMinutes(minutes);
                        field.onChange(newDate);
                      }}
                      placeholder="Enter finish time"
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
              {errors.finishTime && (
                <p className="text-sm text-red-500">
                  {errors.finishTime.message}
                </p>
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
            {updateAppointmentRequestLoader || createAppointmentLoader ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Booking Appointment</span>
              </div>
            ) : (
              "Book Appointment"
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
