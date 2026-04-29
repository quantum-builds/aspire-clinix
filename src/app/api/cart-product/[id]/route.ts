import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/cart-product/{id}:
 *   delete:
 *     summary: Remove a cart product by ID
 *     tags: [Cart Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart product ID (CUID)
 *       - in: query
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID used to authorize deletion
 *     responses:
 *       200:
 *         description: Cart product deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Cart Product deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Cart Product Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Cart Product Id."
 *               data: null
 *       403:
 *         description: Unauthorized to delete this cart product
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "You are not authorized to delete this cart product."
 *               data: null
 *       404:
 *         description: Cart product with this ID does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Cart Product with this Id does not exist."
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
export async function DELETE(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "patient") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const productId = req.nextUrl.pathname.split("/").pop();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || "";

    if (!productId || !isValidCuid(productId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Cart Product Id.", null),
        { status: 400 },
      );
    }

    console.log("product id is ", productId);
    const product = await prisma.cartProduct.findUnique({
      where: { id: productId },
      include: { Cart: true },
    });

    if (!product) {
      return NextResponse.json(
        createResponse(
          false,
          "Cart Product with this Id does not exist.",
          null,
        ),
        { status: 404 },
      );
    }

    if (product.Cart.patientId !== patientId) {
      return NextResponse.json(
        createResponse(
          false,
          "You are not authorized to delete this cart product.",
          null,
        ),
        { status: 403 },
      );
    }

    await prisma.cartProduct.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      createResponse(true, "Cart Product deleted successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in deleting cart product ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
