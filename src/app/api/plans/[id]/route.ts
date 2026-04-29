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
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan fetched successfully."
 *               data:
 *                 id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                 name: "Silver Care Plan"
 *                 description: "Routine preventive dental coverage for adults"
 *                 price: 79.99
 *                 validity: 12
 *                 includedTreatments:
 *                   - "Checkup"
 *                   - "Scale and polish"
 *                   - "X-ray review"
 *                 discountId: null
 *                 status: "ACTIVE"
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:00:00.000Z"
 *       400:
 *         description: Invalid Plan Id
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid Plan Id."
 *       404:
 *         description: Plan does not exist
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan with this Id does not exists."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
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
 *           example:
 *             name: "Silver Care Plan"
 *             description: "Routine preventive dental coverage for adults"
 *             price: 89.99
 *             validity: 12
 *             includedTreatments:
 *               - "Checkup"
 *               - "Scale and polish"
 *               - "X-ray review"
 *             discountId: null
 *             status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan updated successfully."
 *       400:
 *         description: Invalid Plan Id
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid Plan Id."
 *       404:
 *         description: Plan does not exist
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan with this Id does not exist."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
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
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan deleted successfully."
 *       400:
 *         description: Invalid Plan Id
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid Plan Id."
 *       404:
 *         description: Plan does not exist
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan with this Id does not exist."
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
