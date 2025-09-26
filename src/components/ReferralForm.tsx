// "use client";
// import FormInput from "../components/ui/FormInput";
// import { Controller } from "react-hook-form";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CheckboxInput } from "@/components/ui/CheckboxInput";
// import Button from "@/components/ui/CustomButton";
// import { formSchema } from "@/schemas/referralFormSchema";
// import { useMutation } from "@tanstack/react-query";
// import { AxiosError } from "axios";
// import { axiosInstance, ENDPOINTS } from "@/config/api-config";
// import { useRouter } from "next/navigation";
// import { useSendEmail } from "@/services/EmailService";
// import { showToast } from "@/utils/defaultToastOptions";
// import { useCreateReferral } from "@/services/ReferralService";

// type FormData = z.infer<typeof formSchema>;

// const REFERRAL_DETAIL = {
//   name: "referralDetails",
//   options: [
//     { label: "Implants", value: "implants" },
//     { label: "Periodontology", value: "periodontology" },
//     { label: "Oral Surgery", value: "oralSurgery" },
//     { label: "Dentures", value: "dentures" },
//     { label: "Root Canal", value: "rootCanal" },
//     { label: "Paediatric Dentistry", value: "paediatricDentistry" },
//     { label: "Orthodontics", value: "orthodontics" },
//     {
//       label: "Treatment planning & Advice",
//       value: "treatmentPlanningAndAdvice",
//     },
//   ],
// };
// const TREATMENT_APPOINTMENT = {
//   name: "treatMeantAppointment",
//   optionsDentist: [
//     { label: "Yes", value: "yes" },
//     { label: "No", value: "no" },
//   ],
// };

// export default function ReferralForm() {
//   const router = useRouter();
//   const {
//     mutate: sendEmail,
//     isPending: sendingEmailLoader,
//     isSuccess,
//   } = useSendEmail();
//   const { mutate: createReferral, isPending: creatingReferralLoader } =
//     useCreateReferral();

//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       DOB: "",
//       address: "",
//       mobileNumber: "",
//       email: "",
//       referralName: "",
//       referralGDC: "",
//       referralAddress: "",
//       referralMobileNumber: "",
//       referralEmail: "",
//       referralDetails: [],
//       treatMeantAppointment: "",
//       medicalHistory: "",
//     },
//   });

//   const onSubmit = (data: FormData) => {
//     createReferral(
//       { form: data },
//       {
//         onError: (error) => {
//           const message =
//             error instanceof Error ? error.message : "Something went wrong";
//           showToast("error", message);
//         },
//         onSuccess: () => {
//           // First show success when referral is created

//           const emailHtml = `
// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8" />
//     <title>Referral Details</title>
//   </head>
//   <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
//     <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
//       <tr>
//         <td>
//           <h2 style="text-align: center; color: #2a9d8f; margin-top: 0;">Referral Form Summary</h2>
//           <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

//           <h3 style="color: #264653; margin-bottom: 5px;">Patient Details</h3>
//           <p><strong>Name:</strong> ${data.name}</p>
//           <p><strong>Date of Birth:</strong> ${data.DOB}</p>
//           <p><strong>Address:</strong> ${data.address}</p>
//           <p><strong>Mobile Number:</strong> ${data.mobileNumber}</p>
//           <p><strong>Email:</strong> ${data.email}</p>
//           <p><strong>Medical History:</strong> ${
//             data.medicalHistory || "N/A"
//           }</p>

//           <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

//           <h3 style="color: #264653; margin-bottom: 5px;">Referral Details</h3>
//           <p><strong>Details:</strong> ${
//             data.referralDetails?.length
//               ? data.referralDetails.join(", ")
//               : "None"
//           }</p>
//           <p><strong>Other:</strong> ${data.other || "N/A"}</p>
//           <p><strong>Treatment Details:</strong> ${
//             data.treatmentDetails || "N/A"
//           }</p>

//           <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

//           <h3 style="color: #264653; margin-bottom: 5px;">Referring Dentist</h3>
//           <p><strong>Name:</strong> ${data.referralName}</p>
//           <p><strong>GDC Number:</strong> ${data.referralGDC}</p>
//           <p><strong>Practice Address:</strong> ${data.referralAddress}</p>
//           <p><strong>Practice Phone:</strong> ${data.referralMobileNumber}</p>
//           <p><strong>Practice Email:</strong> ${data.referralEmail}</p>

//           <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

//           <h3 style="color: #264653; margin-bottom: 5px;">Treatment Appointment</h3>
//           <p><strong>Attend Appointment:</strong> ${
//             data.treatMeantAppointment || "Not specified"
//           }</p>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>
// `;

//           // Then trigger email
//           sendEmail(
//             {
//               subject: "New Referral Form",
//               html: emailHtml,
//             },
//             {
//               onSuccess: (res) => {
//                 // showToast("success", res.message); // Success after email
//                 // router.replace("/") if needed
//                 setTimeout(() => {
//                   router.replace("/");
//                 }, 1000);
//               },
//               onError: (error) => {
//                 showToast("error", "Error in sending email");
//               },
//             }
//           );
//           {
//             isSuccess && showToast("success", "Referral created successfully");
//           }
//         },
//       }
//     );
//   };

//   return (
//     <div className="bg-feeGuide w-full min-h-screen py-16 font-opus flex justify-center items-center">
//       <div className="zoom-out w-11/12 md:w-3/4 mx-auto flex justify-center items-center flex-col">
//         <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
//           <h1 className="text-[40px] md:text-[52px] font-normal text-left">
//             Referral Form
//           </h1>
//           <h2 className="text-[28px] md:text-[40px] font-medium mt-16 mb-8">
//             Patient Details
//           </h2>
//           <FormInput
//             type="text"
//             name="name"
//             label="Name of Patient"
//             control={control}
//             errorMessage={errors.name?.message}
//             backgroundColor="#ECE8E3"
//             marginTop="50px"
//             padding="13px"
//           />
//           <FormInput
//             type="date"
//             name="DOB"
//             label="Date of Birth"
//             control={control}
//             errorMessage={errors.DOB?.message}
//             backgroundColor="#ECE8E3"
//             marginTop="50px"
//             padding="13px"
//           />
//           <FormInput
//             type="text"
//             name="address"
//             label="Address"
//             control={control}
//             errorMessage={errors.address?.message}
//             backgroundColor="#ECE8E3"
//             marginTop="50px"
//             padding="13px"
//           />
//           <div className="grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-between flex-1 gap-16">
//             <FormInput
//               type="text"
//               name="mobileNumber"
//               label="Mobile Number"
//               control={control}
//               errorMessage={errors.mobileNumber?.message}
//               className="flex-1 w-full"
//               backgroundColor="#ECE8E3"
//               marginTop="50px"
//               padding="13px"
//             />
//             <FormInput
//               type="text"
//               name="email"
//               label="Email Address"
//               control={control}
//               errorMessage={errors.email?.message}
//               className="flex-1 w-full"
//               backgroundColor="#ECE8E3"
//               marginTop="50px"
//               padding="13px"
//             />
//           </div>
//           <div className="mt-6">
//             <h2 className="text-[20px] md:text-[30px] font-normal ">
//               Medical History
//             </h2>
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//           </div>
//           <div>
//             <h3 className="font-opus text-[20px] md:text-[30px]">
//               Referral Details
//             </h3>
//             <div className="grid mt-4 justify-center items-start md:grid-cols-2 gap-1 lg:gap-2 lg:gap-x-20 min-w-max">
//               {REFERRAL_DETAIL.options.map((option) => (
//                 <CheckboxInput
//                   type="checkbox"
//                   key={option.value}
//                   name={REFERRAL_DETAIL.name}
//                   label={option.label}
//                   value={option.value}
//                   control={control}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="mt-5 flex items-center">
//             <label
//               htmlFor="other"
//               className="text-[18px] md:text-[25px] font-normal"
//             >
//               Other
//             </label>
//             <Controller
//               name="other"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <input
//                   type="text"
//                   {...field}
//                   id="other"
//                   className="ml-8 w-[200px] h-[40px] md:w-[334px] md:h-[55px] text-[24px] rounded-lg bg-feeGuide border border-black px-2 outline-none"
//                 />
//               )}
//             />
//           </div>
//           <div className="mt-16">
//             <label
//               htmlFor="treatmentDetails"
//               className="text-[18px] md:text-[25px] font-normal block mb-4"
//             >
//               Please describe the treatment required in as much detail as
//               possible
//             </label>
//             <Controller
//               name="treatmentDetails"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <textarea
//                   {...field}
//                   id="treatmentDetails"
//                   className="w-full h-[223px] text-[24px]  bg-feeGuide border border-black rounded-lg p-4 outline-none"
//                 />
//               )}
//             />
//           </div>
//           <div className="mt-24">
//             <h2 className="text-[28px] md:text-[40px] font-normal">
//               Referring Dentist Details
//             </h2>
//             <FormInput
//               type="text"
//               name="referralName"
//               label="Name of Dentist"
//               control={control}
//               errorMessage={errors.referralName?.message}
//               backgroundColor="#ECE8E3"
//               marginTop="50px"
//               padding="13px"
//             />
//             <FormInput
//               type="text"
//               name="referralGDC"
//               label="GDC Number"
//               control={control}
//               errorMessage={errors.referralGDC?.message}
//               backgroundColor="#ECE8E3"
//               marginTop="50px"
//               padding="13px"
//             />
//             <FormInput
//               type="text"
//               name="referralAddress"
//               label="Practice Name & Address"
//               control={control}
//               errorMessage={errors.referralAddress?.message}
//               backgroundColor="#ECE8E3"
//               marginTop="50px"
//               padding="13px"
//             />
//             <div className="flex flex-wrap justify-between gap-16">
//               <div className="flex flex-1 items-center">
//                 <FormInput
//                   type="text"
//                   name="referralMobileNumber"
//                   label="Practice Phone Number"
//                   control={control}
//                   errorMessage={errors.referralMobileNumber?.message}
//                   className="flex-1"
//                   backgroundColor="#ECE8E3"
//                   marginTop="50px"
//                   padding="13px"
//                 />
//               </div>
//               <FormInput
//                 type="text"
//                 name="referralEmail"
//                 label="Practice Email Address"
//                 control={control}
//                 errorMessage={errors.referralEmail?.message}
//                 className="flex-1"
//                 backgroundColor="#ECE8E3"
//                 marginTop="50px"
//                 padding="13px"
//               />
//             </div>
//             <div className="mt-16">
//               <p className="text-[18px] md:text-[25px] font-normal font-opus mb-4">
//                 Would you like to attend the treatment appointment with the
//                 patient and shadow the dentist?
//               </p>
//               <div className="grid justify-center items-start lg:gap-x-20 grid-cols-2 mt-3">
//                 {TREATMENT_APPOINTMENT.optionsDentist.map((option) => (
//                   <CheckboxInput
//                     type="radio"
//                     key={option.value}
//                     name={TREATMENT_APPOINTMENT.name}
//                     label={option.label}
//                     value={option.value}
//                     control={control}
//                     radioName="name"
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className=" my-20 flex md:justify-start justify-center items-center md:items-start">
//             <Button
//               type="submit"
//               title={
//                 sendingEmailLoader || creatingReferralLoader
//                   ? "Submitting..."
//                   : "Submit Referral"
//               }
//               disabled={sendingEmailLoader || creatingReferralLoader}
//               className={`px-11 py-6 text-black rounded-[5px] md:rounded-xl text-2xl ${
//                 sendingEmailLoader || creatingReferralLoader
//                   ? "bg-bookATreatmentBackground cursor-not-allowed"
//                   : "bg-bookATreatmentBackground"
//               }`}
//             />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import FormInput from "../components/ui/FormInput";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckboxInput } from "@/components/ui/CheckboxInput";
import Button from "@/components/ui/CustomButton";
import { formSchema } from "@/schemas/referralFormSchema";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { useCreateReferral } from "@/services/ReferralService";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { useSendEmail } from "@/services/EmailService";
import { PDFImage, UploadPDFIcon } from "@/assets";
import { CreateReferralForm } from "@/types/referral-form";

// Add optional PDF file validation
const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed",
  })
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
    { message: "File size must be less than 5MB" }
  )
  .optional();

// Extended form schema with optional PDF
const extendedFormSchema = formSchema.extend({
  medicalHistoryPdf: pdfFileSchema,
});

type FormData = z.infer<typeof extendedFormSchema>;

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
  const router = useRouter();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const [medicalHistoryPdf, setMedicalHistoryPdf] = useState<File | null>(null);

  const {
    mutate: sendEmailWithAttachment,
    isPending: sendingEmailLoader,
    isSuccess,
  } = useSendEmail();

  const { mutate: createReferral, isPending: creatingReferralLoader } =
    useCreateReferral();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(extendedFormSchema),
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
      medicalHistory: "",
      medicalHistoryPdf: undefined,
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        showToast("error", "Only PDF files are allowed");
        e.target.value = "";
        setMedicalHistoryPdf(null);
        setValue("medicalHistoryPdf", undefined, { shouldValidate: true });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        showToast("error", "File size must be less than 5MB");
        e.target.value = "";
        setMedicalHistoryPdf(null);
        setValue("medicalHistoryPdf", undefined, { shouldValidate: true });
        return;
      }

      setMedicalHistoryPdf(file);
      setValue("medicalHistoryPdf", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    const referralDetail: CreateReferralForm = {
      name: data.name,
      DOB: data.DOB,
      address: data.address,
      mobileNumber: data.mobileNumber,
      email: data.email,
      referralName: data.referralName,
      referralGDC: data.referralGDC,
      referralAddress: data.referralAddress,
      referralMobileNumber: data.referralMobileNumber,
      referralEmail: data.referralEmail,
      referralDetails: data.referralDetails, // optional
      treatMeantAppointment: data.treatMeantAppointment, // optional
      treatmentDetails: data.treatmentDetails, // optional
      // medicalHistory: data.medicalHistory,       // if you add back in schema
      // medicalHistoryPdf: data.medicalHistoryPdf, // if you add back in schema
    };

    createReferral(
      { form: referralDetail },
      {
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Something went wrong";
          showToast("error", message);
        },
        onSuccess: async () => {
          const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Referral Details</title>
  </head>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <tr>
        <td style="background: #2a9d8f; padding: 20px; text-align: center; color: #fff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Referral Form Summary</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 25px;">
          
          <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Patient Details</h2>
          <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
            <tr><td><strong>Date of Birth:</strong></td><td>${
              data.DOB
            }</td></tr>
            <tr><td><strong>Address:</strong></td><td>${data.address}</td></tr>
            <tr><td><strong>Mobile Number:</strong></td><td>${
              data.mobileNumber
            }</td></tr>
            <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
            <tr><td><strong>Medical History:</strong></td><td>${
              data.medicalHistory || "N/A"
            }</td></tr>
          </table>
          
          <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Referral Details</h2>
          <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            <tr><td><strong>Details:</strong></td><td>${
              data.referralDetails?.length
                ? data.referralDetails.join(", ")
                : "None"
            }</td></tr>
            <tr><td><strong>Other:</strong></td><td>${
              data.other || "N/A"
            }</td></tr>
            <tr><td><strong>Treatment Details:</strong></td><td>${
              data.treatmentDetails || "N/A"
            }</td></tr>
          </table>
          
          <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Referring Dentist</h2>
          <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            <tr><td><strong>Name:</strong></td><td>${
              data.referralName
            }</td></tr>
            <tr><td><strong>GDC Number:</strong></td><td>${
              data.referralGDC
            }</td></tr>
            <tr><td><strong>Practice Address:</strong></td><td>${
              data.referralAddress
            }</td></tr>
            <tr><td><strong>Practice Phone:</strong></td><td>${
              data.referralMobileNumber
            }</td></tr>
            <tr><td><strong>Practice Email:</strong></td><td>${
              data.referralEmail
            }</td></tr>
          </table>
          
          <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Treatment Appointment</h2>
          <p style="font-size: 14px; line-height: 1.6; margin: 0;">
            <strong>Attend Appointment:</strong> ${
              data.treatMeantAppointment || "Not specified"
            }
          </p>
          
        </td>
      </tr>
      <tr>
        <td style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
          Aspire Clinic • Confidential Referral Information
        </td>
      </tr>
    </table>
  </body>
</html>
`;

          // Convert PDF to base64 if it exists
          let pdfBase64 = null;
          let pdfFileName = null;

          if (medicalHistoryPdf) {
            try {
              const arrayBuffer = await medicalHistoryPdf.arrayBuffer();
              pdfBase64 = Buffer.from(arrayBuffer).toString("base64");
              pdfFileName = medicalHistoryPdf.name;
            } catch (error) {
              console.error("Error converting PDF to base64:", error);
              showToast("error", "Error processing PDF file");
              return;
            }
          }

          // Send email with attachment
          sendEmailWithAttachment(
            {
              subject: "New Referral Form",
              html: emailHtml,
              attachment: pdfBase64
                ? {
                    content: pdfBase64,
                    filename: pdfFileName!,
                    type: "application/pdf",
                    disposition: "attachment",
                  }
                : null,
            },
            {
              onSuccess: () => {
                showToast("success", "Referral submitted successfully");
                setTimeout(() => {
                  router.replace("/");
                }, 1000);
              },
              onError: () => {
                showToast("error", "Error in sending email");
              },
            }
          );
        },
      }
    );
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
            name="name"
            label="Name of Patient"
            control={control}
            errorMessage={errors.name?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="13px"
          />
          <FormInput
            type="date"
            name="DOB"
            label="Date of Birth"
            control={control}
            errorMessage={errors.DOB?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="13px"
          />
          <FormInput
            type="text"
            name="address"
            label="Address"
            control={control}
            errorMessage={errors.address?.message}
            backgroundColor="#ECE8E3"
            marginTop="50px"
            padding="13px"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-between flex-1 gap-16">
            <FormInput
              type="text"
              name="mobileNumber"
              label="Mobile Number"
              control={control}
              errorMessage={errors.mobileNumber?.message}
              className="flex-1 w-full"
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="13px"
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
              padding="13px"
            />
          </div>

          {/* Medical History Section */}
          <div className="mt-6">
            <h2 className="text-[20px] md:text-[30px] font-normal">
              Medical History
            </h2>

            {/* Text area for medical history */}
            <div className="mt-4">
              <Controller
                name="medicalHistory"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  // <textarea
                  //   {...field}
                  //   placeholder="Enter medical history details..."
                  //   className="w-full h-[150px] text-[18px] bg-[#ECE8E3] border border-gray-300 rounded-lg p-4 outline-none resize-none"
                  // />
                  <textarea
                    {...field}
                    placeholder="Enter medical history details..."
                    className="w-full h-[223px] text-[24px]  bg-feeGuide border border-black rounded-lg p-4 outline-none"
                  />
                )}
              />
            </div>

            {/* PDF Upload Section */}
            <div className="flex flex-col justify-center gap-2 mt-4">
              <div className="flex gap-5 items-center w-fit">
                <div
                  className="flex gap-5 items-center w-fit cursor-pointer"
                  onClick={() => {
                    document.getElementById("medicalHistoryPdfUpload")?.click();
                  }}
                >
                  <p
                    className={`relative text-md lg:text-lg font-semibold text-green-600 ${
                      !medicalHistoryPdf
                        ? "after:content-[''] after:block after:w-full after:h-[2px] after:bg-green-600 after:-mt-1"
                        : ""
                    }`}
                  >
                    {medicalHistoryPdf
                      ? medicalHistoryPdf.name
                      : "Upload Medical History PDF (Optional)"}
                  </p>

                  <Image
                    src={UploadPDFIcon}
                    alt="pdf-upload-icon"
                    width={20}
                    height={20}
                    className="w-20 h-20"
                  />
                </div>
                {medicalHistoryPdf && (
                  <span className="text-[#0ACF83] text-base cursor-default whitespace-nowrap">
                    ✓ PDF Uploaded
                  </span>
                )}
              </div>
              <input
                type="file"
                id="medicalHistoryPdfUpload"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-gray-500 text-sm">
                Only PDF files are allowed (Max size: 5MB). This field is
                optional.
              </p>
              {errors.medicalHistoryPdf && (
                <p className="text-sm text-red-500">
                  {errors.medicalHistoryPdf.message as string}
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
            <FormInput
              type="text"
              name="referralAddress"
              label="Practice Name & Address"
              control={control}
              errorMessage={errors.referralAddress?.message}
              backgroundColor="#ECE8E3"
              marginTop="50px"
              padding="13px"
            />
            <div className="flex flex-wrap justify-between gap-16">
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
          <div className=" my-20 flex md:justify-start justify-center items-center md:items-start">
            <Button
              type="submit"
              title={
                sendingEmailLoader || creatingReferralLoader
                  ? "Submitting..."
                  : "Submit Referral"
              }
              disabled={sendingEmailLoader || creatingReferralLoader}
              className={`px-11 py-6 text-black rounded-[5px] md:rounded-xl text-2xl ${
                sendingEmailLoader || creatingReferralLoader
                  ? "bg-bookATreatmentBackground cursor-not-allowed"
                  : "bg-bookATreatmentBackground"
              }`}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
