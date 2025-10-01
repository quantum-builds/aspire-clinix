import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const token = await getToken({ req });

    // if (!token || token.role !== TokenRoles.ADMIN) {
    //   return NextResponse.json(
    //     createResponse(false, "Forbidden to perform this action", null),
    //     {
    //       status: 403,
    //     }
    //   );
    // }

    const practice = await req.json();
    const newPractce = await prisma.practice.create({
      data: { ...practice },
    });

    return NextResponse.json(
      createResponse(true, "Practices created successfully", newPractce),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(
        createResponse(false, "Forbidden to perform this action", null),
        {
          status: 403,
        }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status") || "";

    const limit = 10;
    const skip = (page - 1) * limit;

    const nhsFilter =
      statusParam !== "" ? statusParam.toLowerCase() === "true" : undefined;

    const baseWhere: Prisma.PracticeWhereInput = {
      ...(search && { id: { contains: search, mode: "insensitive" } }),
      ...(nhsFilter !== undefined && { nhs: nhsFilter }),
    };

    const [practices, totalCount] = await Promise.all([
      prisma.practice.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.practice.count({ where: baseWhere }),
    ]);

    if (!practices || practices.length < 1) {
      return NextResponse.json(
        createResponse(false, "No practice found", null),
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      createResponse(true, "Practices fetched successfully", {
        practices,
        pagination: {
          page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in fetching practices ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
