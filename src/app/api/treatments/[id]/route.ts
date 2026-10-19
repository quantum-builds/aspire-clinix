import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const treatmentId = req.nextUrl.pathname.split("/").pop();

    if (!treatmentId || !isValidCuid(treatmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Treatment Id.", null),
        { status: 400 },
      );
    }

    const treatment = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!treatment) {
      return NextResponse.json(
        createResponse(false, "Treatment does not exist.", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Treatment fetched successfully.", treatment),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in fetching treatment", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const treatmentId = req.nextUrl.pathname.split("/").pop();

    if (!treatmentId || !isValidCuid(treatmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Treatment Id.", null),
        { status: 400 },
      );
    }

    const existingTreatment = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!existingTreatment) {
      return NextResponse.json(
        createResponse(false, "Treatment does not exist.", null),
        { status: 404 },
      );
    }

    const { name, description, price, availabilities, isActive } =
      await req.json();

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return NextResponse.json(
        createResponse(false, "Name must be a non-empty string.", null),
        { status: 400 },
      );
    }

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return NextResponse.json(
        createResponse(false, "Price must be a non-negative number.", null),
        { status: 400 },
      );
    }

    if (description !== undefined && description !== null && typeof description !== "string") {
      return NextResponse.json(
        createResponse(false, "Description must be a string.", null),
        { status: 400 },
      );
    }

    if (isActive !== undefined && typeof isActive !== "boolean") {
      return NextResponse.json(
        createResponse(false, "isActive must be a boolean.", null),
        { status: 400 },
      );
    }

    if (
      availabilities !== undefined &&
      availabilities !== null &&
      !Array.isArray(availabilities)
    ) {
      return NextResponse.json(
        createResponse(false, "Availabilities must be an array.", null),
        { status: 400 },
      );
    }

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    const validAvailabilities = [];

    for (const [index, slot] of (availabilities ?? []).entries()) {
      const { date, startTime, finishTime, duration, totalLimit } = slot ?? {};
      const remainingLimit = slot?.remainingLimit ?? totalLimit;

      if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        isNaN(new Date(date).getTime())
      ) {
        return NextResponse.json(
          createResponse(false, `Availability ${index}: date must be a valid YYYY-MM-DD date.`, null),
          { status: 400 },
        );
      }

      if (
        typeof startTime !== "string" ||
        typeof finishTime !== "string" ||
        !timeRegex.test(startTime) ||
        !timeRegex.test(finishTime)
      ) {
        return NextResponse.json(
          createResponse(false, `Availability ${index}: startTime and finishTime must be HH:mm.`, null),
          { status: 400 },
        );
      }

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [finishHour, finishMinute] = finishTime.split(":").map(Number);
      const windowMinutes =
        finishHour * 60 + finishMinute - (startHour * 60 + startMinute);

      if (windowMinutes <= 0) {
        return NextResponse.json(
          createResponse(false, `Availability ${index}: finishTime must be after startTime.`, null),
          { status: 400 },
        );
      }

      if (!Number.isInteger(duration) || duration <= 0 || duration > windowMinutes) {
        return NextResponse.json(
          createResponse(false, `Availability ${index}: duration must be a positive integer that fits between startTime and finishTime.`, null),
          { status: 400 },
        );
      }

      if (!Number.isInteger(totalLimit) || totalLimit <= 0) {
        return NextResponse.json(
          createResponse(false, `Availability ${index}: totalLimit must be a positive integer.`, null),
          { status: 400 },
        );
      }

      if (
        !Number.isInteger(remainingLimit) ||
        remainingLimit < 0 ||
        remainingLimit > totalLimit
      ) {
        return NextResponse.json(
          createResponse(false, `Availability ${index}: remainingLimit must be an integer between 0 and totalLimit.`, null),
          { status: 400 },
        );
      }

      validAvailabilities.push({
        date,
        startTime,
        finishTime,
        duration: duration as number,
        totalLimit: totalLimit as number,
        remainingLimit: remainingLimit as number,
      });
    }

    const treatment = await prisma.treatment.update({
      where: { id: treatmentId },
      data: {
        name,
        description,
        price,
        isActive,
        ...(Array.isArray(availabilities) && {
          availabilities: validAvailabilities,
        }),
      },
    });

    return NextResponse.json(
      createResponse(true, "Treatment updated successfully.", treatment),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updating treatment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
