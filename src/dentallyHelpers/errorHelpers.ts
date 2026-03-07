import { createResponse } from "@/utils/createResponse"
import { NextResponse } from "next/server"

export enum DATA_TYPE {
    PATIENT = "paient",
    PATIENTS = "patients",
    APPOINTMENT = "appointment",
    PRACTITIONER = "practitioner",
    PRACTITIONERS = "practitioners"
}

const DATA_TYPE_KEY_MAP: Record<DATA_TYPE, string> = {
    [DATA_TYPE.PATIENT]: "patient",
    [DATA_TYPE.APPOINTMENT]: "appointment",
    [DATA_TYPE.PATIENTS]:"patients",
    [DATA_TYPE.PRACTITIONER]:"practitioner",
    [DATA_TYPE.PRACTITIONERS]:"practitioners",
}

export function dentallyErrorHelper(data: any, type: DATA_TYPE) {
    const error = data?.error

    if (error) {
        if (error.type === "invalid_access_error") {
            return {
                isError: true,
                response: NextResponse.json(
                    createResponse(false, "Forbidden", null),
                    { status: 403 }
                ),
            }
        }

        // invalid_request_error or anything else
        return {
            isError: true,
            response: NextResponse.json(
                createResponse(false, "Resource not found", null),
                { status: 404 }
            ),
        }
    }

    const responseKey = DATA_TYPE_KEY_MAP[type]
    return {
        isError: false,
        response: data?.[responseKey] ?? null,
    }
}
