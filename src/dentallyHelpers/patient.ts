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
  // Priority: email → phone → name
  const dentallyQuery =
    query.emailAddress ||
    query.mobilePhone ||
    [query.firstName, query.middleName, query.lastName]
      .filter(Boolean)
      .join(" ");

  console.log("dentally query is ", dentallyQuery);

  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.patient.list(dentallyQuery),
  );
  const patientsResponse = dentallyErrorHelper(
    response.data,
    DATA_TYPE.PATIENTS,
  );

  return patientsResponse;
}

const PATIENT_SEARCH_PAGE_SIZE = 100;
// Pages fetched at the same time, so Dentally isn't flooded with requests.
const PATIENT_SEARCH_CONCURRENCY = 2;

async function fetchPatientsPage(query: string, page: number) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.patient.list(query, page, PATIENT_SEARCH_PAGE_SIZE),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.PATIENTS);
}

export async function searchAllPatients(query: string) {
  const first = await fetchPatientsPage(query, 1);
  if (first.isError) return first;

  const patients = [...(first.response.patients ?? [])];
  const totalPages = Number(first.response.meta?.totalPages) || 1;

  for (let page = 2; page <= totalPages; page += PATIENT_SEARCH_CONCURRENCY) {
    const batch = Array.from(
      { length: Math.min(PATIENT_SEARCH_CONCURRENCY, totalPages - page + 1) },
      (_, i) => fetchPatientsPage(query, page + i),
    );

    for (const result of await Promise.all(batch)) {
      if (!result.isError) patients.push(...(result.response.patients ?? []));
    }
  }

  return {
    isError: false as const,
    response: { patients, meta: first.response.meta },
  };
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
