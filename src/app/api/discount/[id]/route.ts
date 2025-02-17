import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";

// TODO : only admin can access

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const discountId = req.nextUrl.searchParams.get("id");

  try {
    if (!discountId || !isValidCuid(discountId)) {
      return NextResponse.json(
        { message: "Invalid Discount Id." },
        { status: 400 }
      );
    }

    const discount = await prisma.discount.findUnique({
      where: { id: discountId },
    });

    if (!discount) {
      return NextResponse.json(
        { message: "discount with this Id does not exists." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Discount fetched successfully.",
        data: discount,
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

// TODO : only admin can access

export async function PUT(req: NextRequest) {
  if (req.method !== ApiMethods.PUT) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const discountId = req.nextUrl.searchParams.get("id");

  if (!discountId || !isValidCuid(discountId)) {
    return NextResponse.json(
      { message: "Invalid Discount Id." },
      { status: 400 }
    );
  }

  const updatedDiscount = await req.json();

  try {
    const discount = await prisma.discount.findUnique({
      where: { id: discountId },
    });
    if (discount) {
      await prisma.discount.update({
        where: { id: discountId },
        data: updatedDiscount,
      });
      return NextResponse.json(
        { message: "Discount updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Discount with this Id does not exists." },
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
