import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// TODO : only admin can access

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  try {
    const discounts = await prisma.discount.findMany({});

    if (discounts.length === 0) {
      return NextResponse.json(
        { message: "No discounts exist yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Discount fetched successfully.",
        data: discounts,
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

// TODO : only admin can access

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const discount = await req.json();

  try {
    await prisma.discount.create({
      data: discount,
    });

    return NextResponse.json(
      { message: "Discount created successfully. " },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
