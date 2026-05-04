import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get all plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Plan fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan fetched successfully."
 *               data:
 *                 - id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                   name: "Silver Care Plan"
 *                   description: "Routine preventive dental coverage for adults"
 *                   price: 79.99
 *                   validity: 12
 *                   includedTreatments:
 *                     - "Checkup"
 *                     - "Scale and polish"
 *                     - "X-ray review"
 *                   discountId: null
 *                   status: "ACTIVE"
 *                   createdAt: "2026-04-29T10:00:00.000Z"
 *                   updatedAt: "2026-04-29T10:00:00.000Z"
 *       404:
 *         description: No plan exist yet
 *         content:
 *           application/json:
 *             example:
 *               message: "No plan exist yet"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             example:
 *               message: "Methond not allowed."
 *   post:
 *     summary: Create a plan
 *     tags: [Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               validity:
 *                 type: integer
 *               includedTreatments:
 *                 type: array
 *                 items:
 *                   type: string
 *               discountId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, EXPIRED, UPCOMING]
 *             example:
 *               name: Silver Care Plan
 *               description: Routine preventive dental coverage for adults
 *               price: 79.99
 *               validity: 12
 *               includedTreatments:
 *                 - Checkup
 *                 - Scale and polish
 *                 - X-ray review
 *               discountId: null
 *               status: ACTIVE
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Plan created successfully. "
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             example:
 *               message: "Methond not allowed."
 */
export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 },
    );
  }

  try {
    const plans = await prisma.plan.findMany({});

    if (plans.length === 0) {
      return NextResponse.json(
        { message: "No plan exist yet" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Plan fetched successfully.",
        data: plans,
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

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 },
    );
  }

  const plan = await req.json();

  try {
    await prisma.plan.create({
      data: plan,
    });

    return NextResponse.json(
      { message: "Plan created successfully. " },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
