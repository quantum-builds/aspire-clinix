import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const planId = req.nextUrl.searchParams.get("id");

  try {
    if (!planId || !isValidCuid(planId)) {
      return NextResponse.json(
        { message: "Invalid Plan Id." },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Plan with this Id does not exists." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Plan fetched successfully.",
        data: plan,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (req.method !== ApiMethods.PUT) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const planId = req.nextUrl.searchParams.get("id");

  if (!planId || !isValidCuid(planId)) {
    return NextResponse.json(
      { message: "Invalid Plan Id." },
      { status: 400 }
    );
  }

  const updatedPlan = await req.json();

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });
    if (plan) {
      await prisma.plan.update({
        where: { id: planId },
        data: updatedPlan,
      });
      return NextResponse.json(
        { message: "Plan updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Plan with this Id does not exists." },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
