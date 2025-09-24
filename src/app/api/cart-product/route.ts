import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

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
      { status: 200 }
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
      { status: 400 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating cart:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
