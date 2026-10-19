import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const treatments = await prisma.treatment.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (treatments.length === 0) {
      return NextResponse.json(
        createResponse(false, "No treatments found.", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Treatments fetched successfully.", treatments),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in fetching treatments", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
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

    const {
      name,
      description,
      price,
      availabilities,
      isActive,
      stripeProductId,
      stripePriceId,
    } = await req.json();

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        createResponse(false, "Name is required.", null),
        { status: 400 },
      );
    }

    if (typeof stripeProductId !== "string" || !stripeProductId.trim()) {
      return NextResponse.json(
        createResponse(false, "Stripe product id is required.", null),
        { status: 400 },
      );
    }

    if (typeof stripePriceId !== "string" || !stripePriceId.trim()) {
      return NextResponse.json(
        createResponse(false, "Stripe price id is required.", null),
        { status: 400 },
      );
    }

    if (typeof price !== "number" || price < 0) {
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

    const treatment = await prisma.treatment.create({
      data: {
        name,
        stripeProductId: stripeProductId.trim(),
        stripePriceId: stripePriceId.trim(),
        description,
        price,
        isActive,
        ...(Array.isArray(availabilities) && {
          availabilities: validAvailabilities,
        }),
      },
    });

    return NextResponse.json(
      createResponse(true, "Treatment created successfully.", treatment),
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating treatment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
