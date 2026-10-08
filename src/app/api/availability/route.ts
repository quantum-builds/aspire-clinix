import { getAvailability } from "@/dentallyHelpers/availability";
import { TAvailabilitySlot } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const MIN_AVAILABILITY_RANGE_MS = 24 * 60 * 60 * 1000;

type DentallyAvailabilityEntry = {
  startTime?: string | null;
  finishTime?: string | null;
  availableDuration?: number | null;
  practitionerId?: number | null;
};

type DentallyErrorResponse = {
  error?: {
    message?: string;
  };
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | DentallyErrorResponse
      | undefined;
    const upstreamMessage = responseData?.error?.message;

    if (upstreamMessage) {
      return upstreamMessage;
    }
  }

  return error instanceof Error ? error.message : String(error);
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const { searchParams } = req.nextUrl;
    const practitionerIdRaw = searchParams.get("practitionerId");
    const startTime = searchParams.get("startTime");
    const finishTime = searchParams.get("finishTime");
    const durationRaw = searchParams.get("duration");
    const practitionerId = Number(practitionerIdRaw);

    if (
      !practitionerIdRaw ||
      !Number.isInteger(practitionerId) ||
      practitionerId <= 0
    ) {
      return NextResponse.json(
        createResponse(false, "A valid practitionerId is required.", null),
        { status: 400 },
      );
    }

    if (!startTime || !finishTime) {
      return NextResponse.json(
        createResponse(false, "startTime and finishTime are required.", null),
        { status: 400 },
      );
    }

    const startDate = new Date(startTime);
    const finishDate = new Date(finishTime);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(finishDate.getTime())
    ) {
      return NextResponse.json(
        createResponse(
          false,
          "startTime and finishTime must be valid dates.",
          null,
        ),
        { status: 400 },
      );
    }

    if (
      finishDate.getTime() - startDate.getTime() <
      MIN_AVAILABILITY_RANGE_MS
    ) {
      return NextResponse.json(
        createResponse(
          false,
          "finishTime must be at least 24 hours after startTime.",
          null,
        ),
        { status: 400 },
      );
    }

    // Clamp startTime to now if it's in the past
    const now = new Date();
    const effectiveStartDate =
      startDate.getTime() <= now.getTime() ? now : startDate;
    const effectiveStartTime = effectiveStartDate.toISOString();

    const duration = durationRaw ? Number(durationRaw) : null;
    const effectiveDuration =
      duration !== null && Number.isInteger(duration) && duration > 0
        ? duration
        : null;

    const availabilityResponse = await getAvailability({
      practitionerId,
      startTime: effectiveStartTime,
      finishTime,
      duration: effectiveDuration,
    });

    if (availabilityResponse.isError) {
      return availabilityResponse.response;
    }

    const slots: TAvailabilitySlot[] = (
      (availabilityResponse.response.availability ||
        []) as DentallyAvailabilityEntry[]
    )
      .filter((entry) => entry.startTime && entry.finishTime)
      .map((entry) => ({
        startTime: entry.startTime as string,
        finishTime: entry.finishTime as string,
        availableDuration: entry.availableDuration ?? 0,
        practitionerId: entry.practitionerId ?? practitionerId,
      }));

    return NextResponse.json(
      createResponse(true, "Availability fetched successfully.", slots),
      { status: 200 },
    );
  } catch (error) {
    const status =
      axios.isAxiosError(error) && error.response ? error.response.status : 500;

    return NextResponse.json(
      createResponse(false, getErrorMessage(error), null),
      { status },
    );
  }
}
