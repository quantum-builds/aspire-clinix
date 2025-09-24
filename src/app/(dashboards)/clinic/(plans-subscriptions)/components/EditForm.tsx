"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof baseSchema>;

interface PlanSubscriptionFormProps {
  type: "plan" | "subscription";
  defaultValues: FormData;
}

export default function PlanSubscriptionForm({
  type,
  defaultValues,
}: PlanSubscriptionFormProps) {
  const [isDirty, setIsDirty] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues,
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
    console.log(`${type} form submitted:`, data);
  };

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* White Card */}
      <div className="bg-white rounded-2xl p-6 space-y-10">
        <p className="text-2xl font-medium">{capitalizedType}</p>

        {/* Row 1: Title + Tagline */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg font-medium">
                {capitalizedType} Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={`Enter ${type} name`}
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium">
                {capitalizedType} Tag Line
              </Label>
              <Controller
                name="tagline"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={`Enter ${type} tagline`}
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.tagline && (
                <p className="text-sm text-red-500">{errors.tagline.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Price */}
          <div className="grid grid-cols-2">
            <div className="space-y-2">
              <Label className="text-lg font-medium">
                {capitalizedType} Price ($)
              </Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={`Enter ${type} price`}
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Description */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="treatmentDescription"
                  placeholder="Please write your description here..."
                  className="border border-green px-6 py-3 h-[200px] rounded-2xl w-full focus:outline-none"
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons OUTSIDE */}
      {isDirty && (
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            type="button"
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
