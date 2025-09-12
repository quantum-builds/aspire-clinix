import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "patient") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const productId = req.nextUrl.pathname.split("/").pop();

    if (!productId || !isValidCuid(productId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Cart Product Id.", null),
        { status: 400 }
      );
    }

    const product = await prisma.cartProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        createResponse(
          false,
          "Cart Product with this Id does not exist.",
          null
        ),
        { status: 404 }
      );
    }

    await prisma.cartProduct.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      createResponse(true, "Cart Product deleted successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in deleting cart product ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
