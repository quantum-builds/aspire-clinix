import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               productId:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               ratings:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *             example:
 *               name: Whitening Toothpaste
 *               productId: PROD-001
 *               price: 12.99
 *               stock: 50
 *               ratings: 4.8
 *               imageUrl: https://example.com/images/whitening-toothpaste.jpg
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Product updated successfully."
 *               data: null
 *       400:
 *         description: Invalid Product Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Product Id."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (CUID)
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Product deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Product Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Product Id."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Product with this Id does not exist."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 */
export async function PATCH(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "admin") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const productId = req.nextUrl.pathname.split("/").pop();

    if (!productId || !isValidCuid(productId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Product Id.", null),
        { status: 400 },
      );
    }

    const updatedProduct = await req.json();

    await prisma.product.update({
      where: { id: productId },
      data: updatedProduct,
    });

    return NextResponse.json(
      createResponse(true, "Product updated successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updating product ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "admin") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const productId = req.nextUrl.pathname.split("/").pop();

    if (!productId || !isValidCuid(productId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Product Id.", null),
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        createResponse(false, "Product with this Id does not exist.", null),
        { status: 404 },
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      createResponse(true, "Product deleted successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in deleting product ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
