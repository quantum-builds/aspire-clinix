import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";
import { TPatient } from "@/types/patient";

export async function getPatient() {
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(ENDPOINTS.patient.getPatientByDentallyId);
    const responseData: Response<any> = response.data;
    
    let patient: any = responseData.data?.patient || responseData.data;

    if (patient) {
      // Map emailAddress to email if email is missing
      if (!patient.email && patient.emailAddress) {
        patient.email = patient.emailAddress;
      }

      // Map postcode to postCode if postCode is missing
      if (!patient.postCode && patient.postcode) {
        patient.postCode = patient.postcode;
      }

      // Map addressLine_1 to addressLine1
      if (!patient.addressLine1 && patient.addressLine_1) {
        patient.addressLine1 = patient.addressLine_1;
      }

      // Ensure paymentPlanId is a string
      if (patient.paymentPlanId !== undefined && patient.paymentPlanId !== null) {
        patient.paymentPlanId = String(patient.paymentPlanId);
      }

      // Map gender boolean to string
      if (typeof patient.gender === "boolean") {
        patient.gender = patient.gender ? "male" : "female";
      }

      // Handle profile image
      if (!patient.fileUrl && patient.imageUrl) {
        patient.fileUrl = patient.imageUrl;
      }

      // Ensure dateOfBirth is a Date object if it's a string
      if (patient.dateOfBirth && typeof patient.dateOfBirth === "string") {
        patient.dateOfBirth = new Date(patient.dateOfBirth);
      }

      const upload = patient.fileUrl ? await getAMedia(patient.fileUrl) : null;
      patient.file = upload?.files?.[0] ?? null;
      responseData.data = patient;
     
    }

    responseData.data = patient;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching patient: ", errorMessage);

      return { errorMessage };
    }
  }
}
