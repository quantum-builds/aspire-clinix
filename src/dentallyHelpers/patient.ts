import {
  axiosDentallyInstance,
  DENTALLY_ENDPOINTS,
  ENDPOINTS,
} from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";
import { normalize } from "@/utils/formatWords";
import { patientQuery, TPatientCreate } from "@/types/patient";
import { NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";

export async function getPatientById(patientId: string) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.patient.get(patientId),
  );

  return dentallyErrorHelper(response.data, DATA_TYPE.PATIENT);
}

export async function getPatient(query: patientQuery) {
  console.log("=== DENTALLY DEBUG ===");
  console.log("TOKEN:", process.env.DENTALLY_TOKEN);
  console.log("ENDPOINT:", process.env.DENTALLY_ENDPOINT);
  console.log("QUERY:", query);
  console.log(
    "FULL URL:",
    `${process.env.DENTALLY_ENDPOINT}patients?query=${query}`,
  );

  // Priority: email → phone → name
  const dentallyQuery =
    query.emailAddress ||
    query.mobilePhone ||
    [query.firstName, query.middleName, query.lastName]
      .filter(Boolean)
      .join(" ");

  console.log("dentallyQuery", dentallyQuery);

  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.patient.list(dentallyQuery),
  );
  console.log("response from dentally is ", response);
  const patientsResponse = dentallyErrorHelper(
    response.data,
    DATA_TYPE.PATIENTS,
  );

  return patientsResponse;
}

export async function getPatients() {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.patient.list(),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.PATIENTS);
}

export async function createPatient(patientData: TPatientCreate) {
  console.log("patient is ", JSON.stringify(patientData));
  const response = await axiosDentallyInstance.post(
    DENTALLY_ENDPOINTS.patient.create,
    patientData,
  );
  console.log("respons in dentally is ", response);
  return dentallyErrorHelper(response.data, DATA_TYPE.PATIENT);
}

export async function patchPatientById(patientId: string, partialPatient: any) {
  const response = await axiosDentallyInstance.patch(
    DENTALLY_ENDPOINTS.patient.edit(patientId),
    partialPatient,
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.PATIENT);
}

export async function deletePatientById(patientId: string) {
  const response = await axiosDentallyInstance.delete(
    DENTALLY_ENDPOINTS.patient.delete(patientId),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.PATIENT);
}
