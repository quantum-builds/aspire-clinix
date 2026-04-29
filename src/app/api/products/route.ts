import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Products fetched successfully."
 *               data:
 *                 products:
 *                   - id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                     name: "Whitening Toothpaste"
 *                     productId: "PROD-001"
 *                     price: 12.99
 *                     stock: 50
 *                     ratings: 4.8
 *                     imageUrl: "https://example.com/images/whitening-toothpaste.jpg"
 *                     createdAt: "2026-04-29T10:00:00.000Z"
 *                     updatedAt: "2026-04-29T10:00:00.000Z"
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 42
 *                   totalPages: 5
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No products found."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Product created successfully."
 *               data: null
 *       400:
 *         description: Product already exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Product already exist"
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
        { status: 404 },
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
      { status: 200 },
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
        },
      );
    }

    await prisma.product.create({
      data: product,
    });

    return NextResponse.json(
      createResponse(true, "Product created successfully.", null),
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating product ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
