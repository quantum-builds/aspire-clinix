import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  try {
    const plans = await prisma.plan.findMany({});

    if (plans.length === 0) {
      return NextResponse.json(
        { message: "No plan exist yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Plan fetched successfully.",
        data: plans,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const plan = await req.json();

  try {
    await prisma.plan.create({
      data: plan,
    });

    return NextResponse.json(
      { message: "Plan created successfully. " },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
