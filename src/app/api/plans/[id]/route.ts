import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID (CUID)
 *     responses:
 *       200:
 *         description: Plan fetched successfully
 *       400:
 *         description: Invalid Plan Id
 *       404:
 *         description: Plan does not exist
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       400:
 *         description: Invalid Plan Id
 *       404:
 *         description: Plan does not exist
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID (CUID)
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       400:
 *         description: Invalid Plan Id
 *       404:
 *         description: Plan does not exist
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

  const planId = req.nextUrl.pathname.split("/").pop();

  try {
    if (!planId || !isValidCuid(planId)) {
      return NextResponse.json(
        { message: "Invalid Plan Id." },
        { status: 400 },
      );
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Plan with this Id does not exists." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Plan fetched successfully.",
        data: plan,
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

export async function PUT(req: NextRequest) {
  if (req.method !== ApiMethods.PUT) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 },
    );
  }

  const planId = req.nextUrl.pathname.split("/").pop();

  if (!planId || !isValidCuid(planId)) {
    return NextResponse.json({ message: "Invalid Plan Id." }, { status: 400 });
  }

  const updatedPlan = await req.json();

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Plan with this Id does not exist." },
        { status: 404 },
      );
    }

    await prisma.plan.update({
      where: { id: planId },
      data: updatedPlan,
    });
    return NextResponse.json(
      { message: "Plan updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const planId = req.nextUrl.pathname.split("/").pop();

  if (!planId || !isValidCuid(planId)) {
    return NextResponse.json({ message: "Invalid Plan Id." }, { status: 400 });
  }

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Plan with this Id does not exist." },
        { status: 404 },
      );
    }

    await prisma.plan.delete({
      where: { id: planId },
    });

    return NextResponse.json(
      { message: "Plan deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
