import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/cart-product:
 *   get:
 *     summary: Get cart products for a patient
 *     tags: [Cart Product]
 *     parameters:
 *       - in: query
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID used to fetch the cart
 *     responses:
 *       200:
 *         description: Cart items fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Cart items fetched successfully."
 *               data:
 *                 - id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                   cartId: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                   productId: "ckx1r2a3b0003s2v1b1b2c3d4"
 *                   quantity: 2
 *                   price: 49.99
 *                   total: 99.98
 *                   fileName: "treatment-guide.pdf"
 *                   fileUrl: "https://example.com/files/treatment-guide.pdf"
 *                   title: "Treatment Guide"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   post:
 *     summary: Add or update a cart product
 *     tags: [Cart Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - patientId
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               patientId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Cart updated successfully"
 *               data: 3
 *       400:
 *         description: Invalid product data
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid product data"
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
export async function GET(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "patient" || !token.id) {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    // const patientId =token.id as string;
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || "";

    const cart = await prisma.cart.findUnique({
      where: { patientId },
      include: {
        cartProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    const carttProducts = cart?.cartProducts;

    return NextResponse.json(
      createResponse(true, "Cart items fetched successfully.", carttProducts),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in fetching cart items", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token || token.role !== "patient") {
  //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
  //     status: 401,
  //   });
  // }

  // const patientId = token.id as string;

  const { productId, quantity, patientId } = await req.json();

  if (!productId || !quantity || !patientId) {
    return NextResponse.json(
      createResponse(false, "Invalid product data", null),
      { status: 400 },
    );
  }

  try {
    let cart = await prisma.cart.findUnique({
      where: { patientId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { patientId },
      });
    }

    const existingCartProduct = await prisma.cartProduct.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    let newQuantity;
    if (existingCartProduct) {
      newQuantity = existingCartProduct.quantity + quantity;

      if (newQuantity <= 0) {
        //  Remove product
        await prisma.cartProduct.delete({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId,
            },
          },
        });
      } else {
        // update the quantity
        await prisma.cartProduct.update({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId,
            },
          },
          data: { quantity: newQuantity },
        });
      }
    } else {
      if (quantity > 0) {
        newQuantity = quantity;
        await prisma.cartProduct.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }
    }

    return NextResponse.json(
      createResponse(true, "Cart updated successfully", newQuantity),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in updating cart:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
