import { axiosDentallyInstance, DENTALLY_ENDPOINTS, ENDPOINTS } from "@/config/api-config";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";
import { normalize } from "@/utils/formatWords";
import { patientQuery } from "@/types/patient";
import { NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";

export async function getPatientById(patientId: string) {
    const response = await axiosDentallyInstance.get(DENTALLY_ENDPOINTS.patient.get(patientId))
    return dentallyErrorHelper(response, DATA_TYPE.PATIENT)
}

export async function getPatient(query: patientQuery) {
    // Priority: email → phone → name
    const dentallyQuery =
        query.emailAddress ||
        query.mobilePhone ||
        [query.firstName, query.middleName, query.lastName]
            .filter(Boolean)
            .join(" ")

    if (!dentallyQuery) {
        return {
            isError: true,
            response: NextResponse.json(
                createResponse(false, "Bad Request", null),
                { status: 400 }
            ),
        }
    }

    console.log("axiosDentallyInstance ", axiosDentallyInstance)
    const response = await axiosDentallyInstance.get(
        DENTALLY_ENDPOINTS.patient.list(dentallyQuery)
    )
    console.log("dentally reponse is ", response)
    const errResponse = dentallyErrorHelper(response.data, DATA_TYPE.PATIENTS)
    if (errResponse.isError) {
        return errResponse
    }

    const patients = errResponse.response as any[]

    const filteredPatient = patients.find((patient) => {
        return Object.entries(query).every(([key, value]) => {
            if (value == null) return true

            const patientValue = patient[key]
            if (!patientValue) return false

            return normalize(String(patientValue)) === normalize(String(value))
        })
    })

    return {
        isError: false,
        response: null,
    }
}

export async function getPatients() {
    const response = await axiosDentallyInstance.get(DENTALLY_ENDPOINTS.patient.list())
    return dentallyErrorHelper(response, DATA_TYPE.PATIENTS)
}

export async function patchPatientById(patientId: string, partialPatient: any) {
    const response = await axiosDentallyInstance.patch(DENTALLY_ENDPOINTS.patient.edit(patientId), partialPatient)
    return dentallyErrorHelper(response, DATA_TYPE.PATIENT)
}

export async function createPatient(patientData: any) {
    const response = await axiosDentallyInstance.post(DENTALLY_ENDPOINTS.patient.create, patientData)
    return dentallyErrorHelper(response, DATA_TYPE.PATIENT)
}

export async function deletePatientById(patientId: string) {
    const response = await axiosDentallyInstance.delete(DENTALLY_ENDPOINTS.patient.delete(patientId))
    return dentallyErrorHelper(response, DATA_TYPE.PATIENT)
}
