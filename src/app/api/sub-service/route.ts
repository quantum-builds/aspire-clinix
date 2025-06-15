import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const serviceId = searchParams.get("serviceId");
    console.log("service id is ", serviceId);
    let subServices = [];
    if (serviceId) {
      subServices = await prisma.subService.findMany({
        where: { serviceId: serviceId },
      });
      console.log(subServices);
    } else {
      subServices = await prisma.subService.findMany({});
    }

    if (subServices.length === 0) {
      return NextResponse.json(
        createResponse(false, "No sub-services exist yet", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(
        true,
        "Subservices fetched fetched successfully.",
        subServices
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const subServices = await req.json();

    const subServicesArray = Array.isArray(subServices)
      ? subServices
      : [subServices];

    await prisma.subService.createMany({
      data: subServicesArray,
    });

    return NextResponse.json(
      { message: "Sub services created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const serviceId = searchParams.get("serviceId");
    if (!serviceId) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 }
      );
    }

    let updatedSubServices = await req.json();

    const updatedSubServicesArray = Array.isArray(updatedSubServices)
      ? updatedSubServices
      : [updatedSubServices];

    for (const schedule of updatedSubServicesArray) {
      if (!schedule.id) {
        return NextResponse.json(
          { message: "Each subservice must have an 'id' to update" },
          { status: 400 }
        );
      }
    }

    updatedSubServices = await Promise.all(
      updatedSubServicesArray.map((subService) =>
        prisma.subService.update({
          where: { id: subService.id },
          data: { ...subService },
        })
      )
    );
    return NextResponse.json(
      {
        message: "Subservice updated successfully.",
        data: updatedSubServices,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating subServices:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
