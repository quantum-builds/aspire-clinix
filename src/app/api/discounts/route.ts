import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// TODO : only admin can access

/**
 * @swagger
 * /api/discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: Discount fetched successfully
 *       404:
 *         description: No discounts exist yet
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Create a discount
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Discount created successfully
 *       500:
 *         description: Internal Server Error
 */

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 },
    );
  }

  try {
    const discounts = await prisma.discount.findMany({});

    if (discounts.length === 0) {
      return NextResponse.json(
        { message: "No discounts exist yet" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Discount fetched successfully.",
        data: discounts,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// TODO : only admin can access

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 },
    );
  }

  const discount = await req.json();

  try {
    await prisma.discount.create({
      data: discount,
    });

    return NextResponse.json(
      { message: "Discount created successfully. " },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

