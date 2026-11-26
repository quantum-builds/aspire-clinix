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

async function fetchPatientsPage(query: string | undefined, page: number) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.patient.list(query, page, PATIENT_SEARCH_PAGE_SIZE),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.PATIENTS);
}

export async function searchAllPatients(query?: string) {
  const first = await fetchPatientsPage(query, 1);
  if (first.isError) return first;

  const patients = [...(first.response.patients ?? [])];
  const meta = first.response.meta ?? {};
  const knownTotalPages =
    Number(meta.totalPages) ||
    Math.ceil(Number(meta.total) / PATIENT_SEARCH_PAGE_SIZE) ||
    0;
  let lastPageFull = patients.length === PATIENT_SEARCH_PAGE_SIZE;

  for (
    let page = 2;
    knownTotalPages ? page <= knownTotalPages : lastPageFull;
    page += PATIENT_SEARCH_CONCURRENCY
  ) {
    const batchSize = knownTotalPages
      ? Math.min(PATIENT_SEARCH_CONCURRENCY, knownTotalPages - page + 1)
      : PATIENT_SEARCH_CONCURRENCY;

    const results = await Promise.all(
      Array.from({ length: batchSize }, (_, i) =>
        fetchPatientsPage(query, page + i),
      ),
    );

    lastPageFull = true;
    for (const result of results) {
      // A failed page is skipped; without a known count it also ends the loop.
      const pagePatients = result.isError
        ? []
        : (result.response.patients ?? []);
      patients.push(...pagePatients);
      if (pagePatients.length < PATIENT_SEARCH_PAGE_SIZE) lastPageFull = false;
    }
  }

  return {
    isError: false as const,
    response: { patients, meta: first.response.meta },
  };
}

// Every active, non-archived Dentally patient.
export async function getAllActivePatients(): Promise<any[]> {
  const result = await searchAllPatients();

  if (result.isError) {
    throw new Error("Failed to fetch patients from Dentally");
  }

  return (result.response.patients ?? []).filter(
    (patient: any) => patient.active && !patient.archivedReason,
  );
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
