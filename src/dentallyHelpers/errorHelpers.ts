import { createResponse } from "@/utils/createResponse";
import { NextResponse } from "next/server";

export enum DATA_TYPE {
  PATIENT = "patient",
  PATIENTS = "patients",
  APPOINTMENT = "appointment",
  APPOINTMENTS = "appointments",
  PRACTITIONER = "practitioner",
  PRACTITIONERS = "practitioners",
}

const DATA_TYPE_KEY_MAP: Record<DATA_TYPE, string> = {
  [DATA_TYPE.PATIENT]: "patient",
  [DATA_TYPE.APPOINTMENT]: "appointment",
  [DATA_TYPE.APPOINTMENTS]: "appointments",
  [DATA_TYPE.PATIENTS]: "patients",
  [DATA_TYPE.PRACTITIONER]: "practitioner",
  [DATA_TYPE.PRACTITIONERS]: "practitioners",
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

    return {
      isError: true,
      response: NextResponse.json(
        createResponse(false, "Resource not found", null),
        { status: 404 }
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
