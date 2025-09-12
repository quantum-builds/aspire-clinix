import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
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
        { status: 400 }
      );
    }

    const updatedProduct = await req.json();

    await prisma.product.update({
      where: { id: productId },
      data: updatedProduct,
    });

    return NextResponse.json(
      createResponse(true, "Product updated successfully.", null),
      { status: 200 }
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
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        createResponse(false, "Product with this Id does not exist.", null),
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      createResponse(true, "Product deleted successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in deleting product ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
