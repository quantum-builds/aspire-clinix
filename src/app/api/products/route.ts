import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;
    console.log("skip is ", skip);
    const where: Prisma.ProductWhereInput = search
      ? { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    console.log("products are ", products);
    if (!products || !total) {
      return NextResponse.json(
        createResponse(false, "No products found.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Products fetched successfully.", {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching products", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "admin") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const product = await req.json();
    const name = product.name;
    const existingProduct = await prisma.product.findUnique({
      where: { name: name },
    });
    if (existingProduct) {
      return NextResponse.json(
        createResponse(false, "Product already exist", null),
        {
          status: 400,
        }
      );
    }

    await prisma.product.create({
      data: product,
    });

    return NextResponse.json(
      createResponse(true, "Product created successfully.", null),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating product ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
