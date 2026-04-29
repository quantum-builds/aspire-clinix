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
 *         content:
 *           application/json:
 *             example:
 *               message: "Discount fetched successfully."
 *               data:
 *                 - id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                   type: "PERCENTAGE"
 *                   value: 10
 *                   expiresAt: "2026-12-31T00:00:00.000Z"
 *       404:
 *         description: No discounts exist yet
 *         content:
 *           application/json:
 *             example:
 *               message: "No discounts exist yet"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *   post:
 *     summary: Create a discount
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             type: "PERCENTAGE"
 *             value: 10
 *             expiresAt: "2026-12-31T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Discount created successfully. "
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
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
