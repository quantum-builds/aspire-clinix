import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";

// TODO : only admin can access

/**
 * @swagger
 * /api/discounts/{id}:
 *   get:
 *     summary: Get a discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Discount ID (CUID)
 *     responses:
 *       200:
 *         description: Discount fetched successfully
 *       400:
 *         description: Invalid Discount Id
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update a discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Discount ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       400:
 *         description: Invalid Discount Id
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Discount ID (CUID)
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       400:
 *         description: Invalid Discount Id
 *       404:
 *         description: Discount not found
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

  const discountId = req.nextUrl.pathname.split("/").pop();

  try {
    if (!discountId || !isValidCuid(discountId)) {
      return NextResponse.json(
        { message: "Invalid Discount Id." },
        { status: 400 },
      );
    }

    const discount = await prisma.discount.findUnique({
      where: { id: discountId },
    });

    if (!discount) {
      return NextResponse.json(
        { message: "discount with this Id does not exists." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Discount fetched successfully.",
        data: discount,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// TODO : only admin can access

export async function PUT(req: NextRequest) {
  if (req.method !== ApiMethods.PUT) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 },
    );
  }

  const discountId = req.nextUrl.pathname.split("/").pop();

  if (!discountId || !isValidCuid(discountId)) {
    return NextResponse.json(
      { message: "Invalid Discount Id." },
      { status: 400 },
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
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Discount with this Id does not exists." },
        { status: 404 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// TODO : only admin can access

export async function DELETE(req: NextRequest) {
  if (req.method !== ApiMethods.DELETE) {
    return NextResponse.json(
      { message: "Method not allowed." },
      { status: 405 },
    );
  }

  const discountId = req.nextUrl.pathname.split("/").pop();

  if (!discountId || !isValidCuid(discountId)) {
    return NextResponse.json(
      { message: "Invalid Discount Id." },
      { status: 400 },
    );
  }

  try {
    const discount = await prisma.discount.findUnique({
      where: { id: discountId },
    });

    if (!discount) {
      return NextResponse.json(
        { message: "Discount with this Id does not exist." },
        { status: 404 },
      );
    }

    await prisma.discount.delete({
      where: { id: discountId },
    });

    return NextResponse.json(
      { message: "Discount deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
