import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  DOB: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of Birth must be in the format YYYY-MM-DD."
    ),
  address: z.string().min(6, "Address must be at least 6 characters long."),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
  email: z.string().email("Please enter a valid email address."),
  referralName: z
    .string()
    .min(3, "Referral's name must be at least 3 characters long."),
  referralGDC: z
    .string()
    .min(1, "Referral GDC must be provided (specify proper format)."),
  referralAddress: z
    .string()
    .min(6, "Referral's address must be at least 6 characters long."),
  referralMobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Referral's mobile number must be exactly 10 digits."),
  referralEmail: z
    .string()
    .email("Please enter a valid email address for the referral."),
  other: z.string().optional(),
  treatmentDetails: z.string().optional(),
  referralDetails: z.array(z.string()).optional(),
  treatMeantAppointment: z.string().optional(),
  medicalHistory: z.string().optional(),
});
