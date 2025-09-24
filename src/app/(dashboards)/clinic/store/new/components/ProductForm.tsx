"use client";
import { CalenderInputIcon, UploadImageIcon } from "@/assets";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";

const productFormSchema = z.object({
  productTitle: z.string().min(1, "Product title is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Enter a valid positive price",
    }),
  productImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Please upload a product image",
    })
    .refine(
      (file) =>
        !file ||
        (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024),
      { message: "Only image files under 5MB are allowed" }
    ),
});

type FormData = z.infer<typeof productFormSchema>;

const categories = ["Electronics", "Clothing", "Books", "Furniture"];

export default function AddProductForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productTitle: "",
      serialNumber: "",
      category: "",
      price: "",
      productImage: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Product form submitted:", data);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    onChange(file);
    setValue("productImage", file!);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* White Card */}
      <div className="bg-white rounded-2xl p-6 space-y-10">
        <div>
          <p className="text-2xl font-medium">Add Product</p>
        </div>

        <div className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Product Title */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Product Title</Label>
              <Controller
                name="productTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter product title"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.productTitle && (
                <p className="text-sm text-red-500">
                  {errors.productTitle.message}
                </p>
              )}
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Serial Number</Label>
              <Controller
                name="serialNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter serial number"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.serialNumber && (
                <p className="text-sm text-red-500">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-gray px-6 py-3 h-[52px] rounded-2xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Product Price */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">Product Price ($)</Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter product price"
                    className="bg-gray px-6 py-3 h-[52px] rounded-2xl"
                  />
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Upload Image */}
        <div className="space-y-2 grid grid-cols-3">
          <div className="flex flex-col">
            <Label className="text-2xl font-medium mb-10">Upload Image</Label>

            <Controller
              name="productImage"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground">
                  {/* Date + Time Row */}
                  <div className="flex gap-3 items-center justify-end">
                    <div className="flex gap-1 items-center">
                      <Image
                        src={CalenderInputIcon}
                        alt="calender-icon"
                        className="w-5 h-5"
                      />
                      <p className="text-lg">
                        {new Date().toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>

                  {/* Upload Box */}
                  <div
                    onClick={handleUploadClick}
                    className="rounded-2xl w-[420px] h-[240px] flex flex-col items-center justify-center gap-2 bg-white cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                    />
                    <Image src={UploadImageIcon} alt="upload-image" />
                    {field.value && (
                      <p className="text-sm text-gray-600 text-center px-2 truncate w-[90%]">
                        {(field.value as File).name}
                      </p>
                    )}
                  </div>

                  {/* Footer Label */}
                  <p className="text-center text-green font-medium text-lg">
                    Upload Image
                  </p>
                </div>
              )}
            />

            {errors.productImage && (
              <p className="text-sm text-red-500">
                {errors.productImage.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons OUTSIDE */}
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
          Add Product
        </Button>
      </div>
    </form>
  );
}
