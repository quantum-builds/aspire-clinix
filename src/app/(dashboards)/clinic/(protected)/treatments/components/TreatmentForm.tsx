"use client";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";
import Image from "next/image";
import { TimeIconV2 } from "@/assets";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import {
  useCreateTreatment,
  usePatchTreatment,
} from "@/services/treatments/treatmentMutation";
import { TTreatment, TTreatmentCreate } from "@/types/treatment";
import { useGetDentallyPractitioners } from "@/services/dentallyPractitioner/dentallyPractitionerQuery";

type TDentallyPractitioner = {
  id: number;
  firstName: string;
  lastName: string;
};

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const treatmentFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a non-negative number",
    }),
  isActive: z.enum(["True", "False"]),
  stripeProductId: z.string().trim().min(1, "Stripe product ID is required"),
  stripePriceId: z.string().trim().min(1, "Stripe price ID is required"),
  practitionerId: z.string(),
  availabilities: z.array(
    z
      .object({
        date: z.string().min(1, "Date is required"),
        startTime: z.string().regex(timeRegex, "Start time is required"),
        finishTime: z.string().regex(timeRegex, "Finish time is required"),
        duration: z.string().min(1, "Duration is required"),
        totalLimit: z.string().min(1, "Total limit is required"),
        remainingLimit: z.string(),
      })
      .superRefine((slot, ctx) => {
        if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.finishTime)) {
          return;
        }

        const [startHour, startMinute] = slot.startTime.split(":").map(Number);
        const [finishHour, finishMinute] = slot.finishTime.split(":").map(Number);
        const windowMinutes =
          finishHour * 60 + finishMinute - (startHour * 60 + startMinute);

        if (windowMinutes <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["finishTime"],
            message: "Finish time must be after start time",
          });
        }

        const duration = Number(slot.duration);
        if (
          slot.duration &&
          (!Number.isInteger(duration) || duration <= 0 || duration > windowMinutes)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["duration"],
            message: "Duration must be a positive whole number that fits the time window",
          });
        }

        const totalLimit = Number(slot.totalLimit);
        if (slot.totalLimit && (!Number.isInteger(totalLimit) || totalLimit <= 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["totalLimit"],
            message: "Total limit must be a positive whole number",
          });
        }

        const remainingLimit = Number(slot.remainingLimit);
        if (
          slot.remainingLimit !== "" &&
          (!Number.isInteger(remainingLimit) ||
            remainingLimit < 0 ||
            remainingLimit > totalLimit)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["remainingLimit"],
            message: "Remaining limit must be between 0 and total limit",
          });
        }
      })
  ),
});

type FormData = z.infer<typeof treatmentFormSchema>;

const emptySlot = {
  date: "",
  startTime: "09:00",
  finishTime: "17:00",
  duration: "",
  totalLimit: "",
  remainingLimit: "",
};

interface TreatmentFormProps {
  treatment?: TTreatment;
}

export default function TreatmentForm({ treatment }: TreatmentFormProps) {
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const { mutate: createTreatment, isPending: createTreatmentLoader } =
    useCreateTreatment();
  const { mutate: patchTreatment, isPending: patchTreatmentLoader } =
    usePatchTreatment();
  const { data: practitioners, isPending: practitionersLoading } =
    useGetDentallyPractitioners();

  const defaultValues: FormData = {
    name: treatment?.name ?? "",
    description: treatment?.description ?? "",
    price: treatment ? String(treatment.price) : "",
    isActive: treatment && !treatment.isActive ? "False" : "True",
    stripeProductId: treatment?.stripeProductId ?? "",
    stripePriceId: treatment?.stripePriceId ?? "",
    practitionerId: treatment?.practitionerId ?? "",
    availabilities: (treatment?.availabilities ?? []).map((slot) => ({
      date: slot.date,
      startTime: slot.startTime,
      finishTime: slot.finishTime,
      duration: String(slot.duration),
      totalLimit: String(slot.totalLimit),
      remainingLimit: String(slot.remainingLimit),
    })),
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availabilities",
  });

  const practitionerOptions = (practitioners ?? []).map(
    (practitioner: TDentallyPractitioner) => ({
      value: String(practitioner.id),
      label: `${practitioner.firstName} ${practitioner.lastName}`
        .replace(/\s+/g, " ")
        .trim(),
    }),
  );

  // Keep the saved practitioner selectable even if Dentally no longer lists it.
  if (
    treatment?.practitionerId &&
    !practitionerOptions.some(
      (option: { value: string }) => option.value === treatment.practitionerId,
    )
  ) {
    practitionerOptions.push({
      value: treatment.practitionerId,
      label: treatment.practitionerName ?? treatment.practitionerId,
    });
  }

  const onSubmit = (data: FormData) => {
    const selectedPractitioner = practitionerOptions.find(
      (option: { value: string }) => option.value === data.practitionerId,
    );

    const payload: TTreatmentCreate = {
      name: data.name,
      description: data.description || null,
      price: Number(data.price),
      isActive: data.isActive === "True",
      stripeProductId: data.stripeProductId,
      stripePriceId: data.stripePriceId,
      practitionerId: selectedPractitioner ? selectedPractitioner.value : null,
      practitionerName: selectedPractitioner ? selectedPractitioner.label : null,
      availabilities: data.availabilities.map((slot) => ({
        date: slot.date,
        startTime: slot.startTime,
        finishTime: slot.finishTime,
        duration: Number(slot.duration),
        totalLimit: Number(slot.totalLimit),
        ...(slot.remainingLimit !== "" && {
          remainingLimit: Number(slot.remainingLimit),
        }),
      })),
    };

    const handlers = {
      onSuccess: () => {
        showToast(
          "success",
          treatment
            ? "Treatment updated successfully"
            : "Treatment created successfully"
        );
        queryClient.invalidateQueries({ queryKey: ["treatments"] });
        replace("/clinic/treatments");
      },
      onError: (error: unknown) => {
        const msg = getAxiosErrorMessage(error);
        showToast("error", msg);
      },
    };

    if (treatment) {
      patchTreatment({ id: treatment.id, treatment: payload }, handlers);
    } else {
      createTreatment({ treatment: payload }, handlers);
    }
  };

  const isSaving = createTreatmentLoader || patchTreatmentLoader;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-y-hidden">
      <div className="bg-dashboardBarBackground rounded-2xl">
        {/* Section 1: Treatment Form */}
        <div className="rounded-2xl p-6 space-y-10">
          <p className="text-2xl font-medium text-green">Treatment Form</p>

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

            {/* Price */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Price (£)
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 79.99"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Description */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter description"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Status
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={[
                      { value: "True", label: "Active" },
                      { value: "False", label: "Inactive" },
                    ]}
                    value={field.value}
                    onValueChange={(val) => field.onChange(val || "True")}
                    placeholder="Select status"
                    className="w-full"
                    contentClassName="w-full"
                    triggerClassName="bg-gray px-6 py-3 h-[52px] rounded-2xl justify-between"
                    placeholderClassName="text-gray-600"
                    showClearOption={false}
                  />
                )}
              />
              {errors.isActive && (
                <p className="text-sm text-red-500">{errors.isActive.message}</p>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Stripe Product ID */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Stripe Product ID
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="stripeProductId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. prod_..."
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.stripeProductId && (
                <p className="text-sm text-red-500">
                  {errors.stripeProductId.message}
                </p>
              )}
            </div>

            {/* Stripe Price ID */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Stripe Price ID
                <span className="text-red-500 text-sm ml-1">*</span>
              </Label>
              <Controller
                name="stripePriceId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. price_..."
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.stripePriceId && (
                <p className="text-sm text-red-500">
                  {errors.stripePriceId.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Practitioner Dropdown */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Practitioner</Label>
              <Controller
                name="practitionerId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={practitionerOptions}
                    value={field.value}
                    onValueChange={(val) => field.onChange(val || "")}
                    placeholder={
                      practitionersLoading
                        ? "Loading practitioners..."
                        : "Select practitioner"
                    }
                    className="w-full"
                    contentClassName="w-full"
                    triggerClassName="bg-gray px-6 py-3 h-[52px] rounded-2xl justify-between"
                    placeholderClassName="text-gray-600"
                    showClearOption={true}
                  />
                )}
              />
              {errors.practitionerId && (
                <p className="text-sm text-red-500">
                  {errors.practitionerId.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Availabilities */}
        <div className="bg-white rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-medium text-green">Availabilities</p>
            <button
              type="button"
              onClick={() => append(emptySlot)}
              className="text-green font-medium"
            >
              + Add New
            </button>
          </div>

          {fields.length === 0 && (
            <p className="text-lightBlack">No availability slots added yet.</p>
          )}

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium">Slot {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 font-medium"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 items-start">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Date
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </Label>
                    <Controller
                      name={`availabilities.${index}.date`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                        />
                      )}
                    />
                    {errors.availabilities?.[index]?.date && (
                      <p className="text-sm text-red-500">
                        {errors.availabilities[index]?.date?.message}
                      </p>
                    )}
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Start Time
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Controller
                        name={`availabilities.${index}.startTime`}
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
                        src={TimeIconV2}
                        alt="time-icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                      />
                    </div>
                    {errors.availabilities?.[index]?.startTime && (
                      <p className="text-sm text-red-500">
                        {errors.availabilities[index]?.startTime?.message}
                      </p>
                    )}
                  </div>

                  {/* Finish Time */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Finish Time
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Controller
                        name={`availabilities.${index}.finishTime`}
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
                        src={TimeIconV2}
                        alt="time-icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                      />
                    </div>
                    {errors.availabilities?.[index]?.finishTime && (
                      <p className="text-sm text-red-500">
                        {errors.availabilities[index]?.finishTime?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 items-start">
                  {/* Duration */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Duration (minutes)
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </Label>
                    <Controller
                      name={`availabilities.${index}.duration`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="e.g. 30"
                          className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                        />
                      )}
                    />
                    {errors.availabilities?.[index]?.duration && (
                      <p className="text-sm text-red-500">
                        {errors.availabilities[index]?.duration?.message}
                      </p>
                    )}
                  </div>

                  {/* Total Limit */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Total Limit
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </Label>
                    <Controller
                      name={`availabilities.${index}.totalLimit`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="e.g. 8"
                          className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                        />
                      )}
                    />
                    {errors.availabilities?.[index]?.totalLimit && (
                      <p className="text-sm text-red-500">
                        {errors.availabilities[index]?.totalLimit?.message}
                      </p>
                    )}
                  </div>

                  {/* Remaining Limit */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Remaining Limit</Label>
                    <Controller
                      name={`availabilities.${index}.remainingLimit`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="Defaults to total limit"
                          className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                        />
                      )}
                    />
                    {errors.availabilities?.[index]?.remainingLimit && (
                      <p className="text-sm text-red-500">
                        {errors.availabilities[index]?.remainingLimit?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            text={isSaving ? "Saving Changes..." : "Save Changes"}
            type="submit"
            loading={isSaving}
            className="py-3 px-6 h-[60px]"
          />
        </div>
      )}
    </form>
  );
}
