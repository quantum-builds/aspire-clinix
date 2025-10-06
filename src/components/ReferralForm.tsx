"use client";

import FormInput from "../components/ui/FormInput";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckboxInput } from "@/components/ui/CheckboxInput";
import { showToast } from "@/utils/defaultToastOptions";
import { useState, ChangeEvent, useRef } from "react";
import Image from "next/image";
import { CalenderInputIconV2, UploadPDFIcon } from "@/assets";
import { CreateReferralForm, TCreateReferralForm } from "@/types/referral-form";
import { useCreateReferralForm } from "@/services/referralForm/referralFormMutation";
import { useUploadFile } from "@/services/s3/s3Mutatin";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { ResoucrceType } from "@prisma/client";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { TPractice } from "@/types/practice";
import { Input } from "./ui/input";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

export const referralSchema = z.object({
  patientName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  patientDateOfBirth: z.preprocess(
    (val) => {
      if (typeof val === "string" && val) {
        return new Date(val);
      }
      return val === "" ? undefined : val;
    },
    z.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please select a valid date",
    })
  )
    .refine((date) => {
      if (!date) return false;
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 13 && age <= 120;
    }, "You must be between 13 and 120 years old"),
  patientEmail: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  patientAddress: z
    .string()
    .min(6, "Address must be at least 6 characters long."),
  patientPhoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number"
    ),
  referralName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be less than 100 characters"),
  referralGDC: z
    .string()
    .min(4, "GDC number must be at least 4 characters")
    .max(20, "GDC number must be less than 20 characters"),
  referralPracticeId: z
    .string()
    .min(5, "Practice address must be at least 5 characters")
    .max(200, "Practice address must be less than 200 characters"),
  referralPhoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Please enter a valid UK mobile phone number"
    ),
  referralEmail: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  other: z.string().optional(),
  treatmentDetails: z.string().optional(),
  referralDetails: z.array(z.string()),
  attendTreatment: z.string(),

  medicalHistoryPdfUrl: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Please upload a PDF file",
    })
    .refine(
      (file) =>
        !file ||
        (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024),
      { message: "Only PDF files under 5MB are allowed" }
    )
    .optional(),
});

type FormData = z.infer<typeof referralSchema>;

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
  name: "attendTreatment",
  optionsDentist: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};

interface ReferralFormProps {
  practices: TPractice[];
}

export default function ReferralForm({ practices }: ReferralFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: createReferralForm, isPending: creatingReferralFormLoader } =
    useCreateReferralForm();
  const { mutateAsync: uploadFile, isPending: uplaodFileLoader } =
    useUploadFile();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      patientName: "",
      patientDateOfBirth: new Date(),
      patientAddress: "",
      patientPhoneNumber: "",
      patientEmail: "",
      referralName: "",
      referralGDC: "",
      referralPracticeId: "",
      referralPhoneNumber: "",
      referralEmail: "",
      referralDetails: [],
      attendTreatment: "yes",
      medicalHistoryPdfUrl: undefined,
    },
  });

  const handleUploadClick = () => fileInputRef.current?.click();

  const onSubmit = async (data: FormData) => {
    console.log(data);
    let fileUrl = undefined;
    if (data.medicalHistoryPdfUrl) {
      const imageUploaded = await uploadFile({
        selectedFile: data.medicalHistoryPdfUrl,
        fileType: ResoucrceType.PDF,
      });

      fileUrl = `uploads/aspire-clinic/pdfs/${imageUploaded.name}`;
    }
    const referralDetail: TCreateReferralForm = {
      patientName: data.patientName,
      patientDateOfBirth: data.patientDateOfBirth,
      patientEmail: data.patientEmail,
      patientPhoneNumber: data.patientPhoneNumber,
      patientAddress: data.patientAddress,
      referralName: data.referralName,
      referralGDC: data.referralGDC,
      referralPracticeId: data.referralPracticeId,
      referralPhoneNumber: data.referralPhoneNumber,
      referralEmail: data.referralEmail,
      referralDetails: data.referralDetails,
      attendTreatment: data.attendTreatment,
      treatmentDetails: data.treatmentDetails,
      medicalHistoryPdfUrl: fileUrl,
    };

    createReferralForm(
      {
        referralForm: referralDetail,
      },
      {
        onSuccess: () => {
          reset();
          showToast("success", "Referral Form Successfully Send");
        },
        onError: (error) => {
          const err = getAxiosErrorMessage(error);
          showToast("error", err);
        },
      }
    );
    // EMAIL SENDING ONE
    //     createReferral(
    //       { form: referralDetail },
    //       {
    //         onError: (error) => {
    //           const message =
    //             error instanceof Error ? error.message : "Something went wrong";
    //           showToast("error", message);
    //         },
    //         onSuccess: async () => {
    //           const emailHtml = `
    // <!DOCTYPE html>
    // <html>
    //   <head>
    //     <meta charset="UTF-8" />
    //     <title>Referral Details</title>
    //   </head>
    //   <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;">
    //     <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    //       <tr>
    //         <td style="background: #2a9d8f; padding: 20px; text-align: center; color: #fff;">
    //           <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Referral Form Summary</h1>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td style="padding: 25px;">

    //           <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Patient Details</h2>
    //           <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
    //             <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
    //             <tr><td><strong>Date of Birth:</strong></td><td>${
    //               data.patientDateOfBirth
    //             }</td></tr>
    //             <tr><td><strong>Address:</strong></td><td>${data.address}</td></tr>
    //             <tr><td><strong>Mobile Number:</strong></td><td>${
    //               data.mobileNumber
    //             }</td></tr>
    //             <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
    //             <tr><td><strong>Medical History:</strong></td><td>${
    //               data.medicalHistory || "N/A"
    //             }</td></tr>
    //           </table>

    //           <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Referral Details</h2>
    //           <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
    //             <tr><td><strong>Details:</strong></td><td>${
    //               data.referralDetails?.length
    //                 ? data.referralDetails.join(", ")
    //                 : "None"
    //             }</td></tr>
    //             <tr><td><strong>Other:</strong></td><td>${
    //               data.other || "N/A"
    //             }</td></tr>
    //             <tr><td><strong>Treatment Details:</strong></td><td>${
    //               data.treatmentDetails || "N/A"
    //             }</td></tr>
    //           </table>

    //           <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Referring Dentist</h2>
    //           <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
    //             <tr><td><strong>Name:</strong></td><td>${
    //               data.referralName
    //             }</td></tr>
    //             <tr><td><strong>GDC Number:</strong></td><td>${
    //               data.referralGDC
    //             }</td></tr>
    //             <tr><td><strong>Practice Address:</strong></td><td>${
    //               data.referralAddress
    //             }</td></tr>
    //             <tr><td><strong>Practice Phone:</strong></td><td>${
    //               data.referralMobileNumber
    //             }</td></tr>
    //             <tr><td><strong>Practice Email:</strong></td><td>${
    //               data.referralEmail
    //             }</td></tr>
    //           </table>

    //           <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Treatment Appointment</h2>
    //           <p style="font-size: 14px; line-height: 1.6; margin: 0;">
    //             <strong>Attend Appointment:</strong> ${
    //               data.treatMeantAppointment || "Not specified"
    //             }
    //           </p>

    //         </td>
    //       </tr>
    //       <tr>
    //         <td style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
    //           Aspire Clinic • Confidential Referral Information
    //         </td>
    //       </tr>
    //     </table>
    //   </body>
    // </html>
    // `;

    //           // Convert PDF to base64 if it exists
    //           let pdfBase64 = null;
    //           let pdfFileName = null;

    //           if (medicalHistoryPdf) {
    //             try {
    //               const arrayBuffer = await medicalHistoryPdf.arrayBuffer();
    //               pdfBase64 = Buffer.from(arrayBuffer).toString("base64");
    //               pdfFileName = medicalHistoryPdf.name;
    //             } catch (error) {
    //               console.error("Error converting PDF to base64:", error);
    //               showToast("error", "Error processing PDF file");
    //               return;
    //             }
    //           }

    //           // Send email with attachment
    //           sendEmailWithAttachment(
    //             {
    //               subject: "New Referral Form",
    //               html: emailHtml,
    //               attachment: pdfBase64
    //                 ? {
    //                     content: pdfBase64,
    //                     filename: pdfFileName!,
    //                     type: "application/pdf",
    //                     disposition: "attachment",
    //                   }
    //                 : null,
    //             },
    //             {
    //               onSuccess: () => {
    //                 showToast("success", "Referral submitted successfully");
    //                 setTimeout(() => {
    //                   router.replace("/");
    //                 }, 1000);
    //               },
    //               onError: () => {
    //                 showToast("error", "Error in sending email");
    //               },
    //             }
    //           );
    //         },
    //       }
    //     );
  };

  return (
    <div className="bg-feeGuide w-full min-h-screen py-16 font-opus flex justify-center items-center">
      <div className="zoom-out w-11/12 md:w-3/4 mx-auto flex justify-center items-center flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
          <h1 className="text-[40px] md:text-[52px] font-normal text-left">
            Referral Form
          </h1>
          <h2 className="text-[28px] md:text-[40px] font-medium mt-16 mb-8">
            Patient Details
          </h2>
          <FormInput
            type="text"
            name="patientName"
            label="Name of Patient"
            control={control}
            errorMessage={errors.patientName?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="13px"
          />

          <div className="mt-[50px] flex flex-col gap-2 ">
            <Label className="w-1/3 text-[18px] md:text-[28px] font-normal font-opus text-nowrap pb-3">
              Date Of Birth
            </Label>
            <Controller
              name="patientDateOfBirth"
              control={control}
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="none"
                      type="button"
                      className={cn(
                        "relative w-full  p-[13px]  text-left font-opus outline-none flex-1 text-[24px] bg-[#ECE8E36] border border-solid border-[#000000] rounded-[10px]",
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
                        src={CalenderInputIconV2}
                        alt="calender-input"
                        className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => date && field.onChange(date)}
                      captionLayout="dropdown"
                      showOutsideDays={false}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.patientDateOfBirth && (
              <p className=" text-red-500 text-lg">
                {errors.patientDateOfBirth.message}
              </p>
            )}
          </div>
          <FormInput
            type="text"
            name="patientAddress"
            label="Address"
            control={control}
            errorMessage={errors.patientAddress?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="13px"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-between flex-1 gap-16">
            <FormInput
              type="text"
              name="patientPhoneNumber"
              label="Mobile Number"
              control={control}
              errorMessage={errors.patientPhoneNumber?.message}
              className="flex-1 w-full"
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="13px"
            />
            <FormInput
              type="text"
              name="patientEmail"
              label="Email Address"
              control={control}
              errorMessage={errors.patientEmail?.message}
              className="flex-1 w-full"
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="13px"
            />
          </div>

          {/* Medical History Section */}
          <div className="mt-6">
            <h2 className="text-[20px] md:text-[30px] font-normal">
              Medical History
            </h2>

            <div className="space-y-2">
              <Controller
                name="medicalHistoryPdfUrl"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-5">
                      <div
                        onClick={handleUploadClick}
                        className="cursor-pointer"
                      >
                        <input
                          id="fileUpload"
                          type="file"
                          accept="application/pdf"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              field.onChange(file);
                              const objectUrl = URL.createObjectURL(file);
                              setPreviewUrl(objectUrl);
                            }
                          }}
                        />
                        <Image
                          src={UploadPDFIcon}
                          alt="upload-pdf"
                          height={80}
                          width={80}
                        />
                      </div>

                      <Label
                        htmlFor="fileUpload"
                        className="cursor-pointer text-green underline text-xl"
                      >
                        Upload a Document
                      </Label>
                    </div>

                    {field.value && (
                      <PdfModal
                        pdfUrl={previewUrl!}
                        trigger={
                          <div className="flex items-center gap-3 cursor-pointer text-lg">
                            {(field.value as File).name}
                            <p className="underline text-green">See Document</p>
                          </div>
                        }
                      />
                    )}
                  </div>
                )}
              />
              {errors.medicalHistoryPdfUrl && (
                <p className="text-sm text-red-500">
                  {errors.medicalHistoryPdfUrl.message as string}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-opus text-[20px] md:text-[30px] mt-16">
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
              className="text-[18px] md:text-[25px] font-normal"
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
                  className="ml-8 w-[200px] h-[40px] md:w-[334px] md:h-[55px] text-[24px] rounded-lg bg-feeGuide border border-black px-2 outline-none"
                />
              )}
            />
          </div>
          <div className="mt-16">
            <label
              htmlFor="treatmentDetails"
              className="text-[18px] md:text-[25px] font-normal block mb-4"
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
                  className="w-full h-[223px] text-[24px]  bg-feeGuide border border-black rounded-lg p-4 outline-none"
                />
              )}
            />
          </div>
          <div className="mt-24">
            <h2 className="text-[28px] md:text-[40px] font-normal">
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
              padding="13px"
            />
            <FormInput
              type="text"
              name="referralGDC"
              label="GDC Number"
              control={control}
              errorMessage={errors.referralGDC?.message}
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="13px"
            />

            <div className="mt-[50px] flex flex-col gap-2">
              <Label className="w-1/3 text-[18px] md:text-[28px] font-normal font-opus text-nowrap pb-3">
                Practice Address
              </Label>

              {practices && practices.length > 0 ? (
                <Select
                  onValueChange={(val) => {
                    setValue("referralPracticeId", val, {
                      shouldValidate: true,
                    });
                  }}
                  value={watch("referralPracticeId")}
                >
                  <SelectTrigger className="w-full  p-[13px]  text-left font-opus outline-none flex-1 text-[28px] bg-[#ECE8E36] border border-solid border-[#000000] rounded-[10px]">
                    <SelectValue placeholder="Select practice address" />
                  </SelectTrigger>
                  <SelectContent>
                    {practices.map((practice) => (
                      <SelectItem key={practice.id} value={practice.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{practice.name}</span>
                          <span className="text-lg text-muted-foreground">
                            {practice.addressLine1}, {practice.town},{" "}
                            {practice.postcode}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  disabled
                  value="No practice registered yet"
                  className="bg-gray px-6 py-3 h-[52px] rounded-2xl text-muted-foreground"
                />
              )}

              {errors.referralPracticeId && (
                <p className="text-lg text-red-500">
                  {errors.referralPracticeId.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-between gap-16">
              <div className="flex flex-1 items-center">
                <FormInput
                  type="text"
                  name="referralPhoneNumber"
                  label="Practice Phone Number"
                  control={control}
                  errorMessage={errors.referralPhoneNumber?.message}
                  className="flex-1"
                  backgroundColor="#ECE8E3"
                  marginTop="50px"
                  padding="13px"
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
                padding="13px"
              />
            </div>
            <div className="mt-16">
              <p className="text-[18px] md:text-[25px] font-normal font-opus mb-4">
                Would you like to attend the treatment appointment with the
                patient and shadow the dentist?
              </p>
              <div className="grid justify-center items-start lg:gap-x-20 grid-cols-2 mt-3">
                {TREATMENT_APPOINTMENT.optionsDentist.map((option, index) => (
                  <CheckboxInput
                    type="radio"
                    key={index}
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
          <div className=" my-20 flex md:justify-end justify-center items-center md:items-start gap-2">
            <CustomButton
              text="Cancel"
              disabled={creatingReferralFormLoader || uplaodFileLoader}
              handleOnClick={() => reset()}
              textSize={25}
              className="text-[#A3A3A3] bg-gray  shadow-none hover:bg-lightGray font-medium "
            />
            <CustomButton
              text={"Submit Form"}
              type="submit"
              textSize={25}
              disabled={creatingReferralFormLoader || uplaodFileLoader}
              loading={creatingReferralFormLoader || uplaodFileLoader}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
