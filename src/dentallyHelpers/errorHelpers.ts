import { createResponse } from "@/utils/createResponse";
import { NextResponse } from "next/server";

export enum DATA_TYPE {
  PATIENT = "patient",
  PATIENTS = "patients",
  APPOINTMENT = "appointment",
  APPOINTMENTS = "appointments",
  PRACTITIONER = "practitioner",
  PRACTITIONERS = "practitioners",
  TREATMENT = "treatment",
  TREATMENTS = "treatments",
  FEE = "fee",
  FEES = "fees",
  AVAILABILITY = "availability",
}

const DATA_TYPE_KEY_MAP: Record<DATA_TYPE, string> = {
  [DATA_TYPE.PATIENT]: "patient",
  [DATA_TYPE.APPOINTMENT]: "appointment",
  [DATA_TYPE.APPOINTMENTS]: "appointments",
  [DATA_TYPE.PATIENTS]: "patients",
  [DATA_TYPE.PRACTITIONER]: "practitioner",
  [DATA_TYPE.PRACTITIONERS]: "practitioners",
  [DATA_TYPE.TREATMENT]: "treatment",
  [DATA_TYPE.TREATMENTS]: "treatments",
  [DATA_TYPE.FEE]: "fee",
  [DATA_TYPE.FEES]: "fees",
  [DATA_TYPE.AVAILABILITY]: "availability",
};

type ErrorResult = {
  isError: true;
  response: NextResponse;
};

type SuccessResult = {
  isError: false;
  response: {
    [key: string]: any;
    meta: any;
  };
};

type DentallyErrorResult = ErrorResult | SuccessResult;

export function dentallyErrorHelper(
  data: any,
  type?: DATA_TYPE
): DentallyErrorResult {
  const error = data?.error;

  if (error) {
    if (error.type === "invalid_access_error") {
      return {
        isError: true,
        response: NextResponse.json(createResponse(false, "Forbidden", null), {
          status: 403,
        }),
      };
    }

    if (error.type === "invalid_request_error") {
      const errorMessage = error.message || "Invalid request";
      return {
        isError: true,
        response: NextResponse.json(
          createResponse(false, errorMessage, null),
          { status: 400 },
        ),
      };
    }

    return {
      isError: true,
      response: NextResponse.json(
        createResponse(false, "Resource not found", null),
        { status: 404 },
      ),
    };
  }

  const responseKey = type ? DATA_TYPE_KEY_MAP[type] : null;

  if (!responseKey) {
    return {
      isError: false,
      response: { meta: null },
    };
  }

  return {
    isError: false,
    response: {
      [responseKey]: data?.[responseKey] ?? null,
      meta: data?.meta ?? null,
    },
  };
}
