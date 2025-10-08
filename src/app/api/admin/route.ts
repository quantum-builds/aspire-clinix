import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const adminId = token.sub;
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });

    if (!admin) {
      return NextResponse.json(createResponse(false, "No Admin found", admin), {
        status: 404,
      });
    }

    return NextResponse.json(
      createResponse(true, "Admin record successfully fetched", admin),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching admin ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await req.json();
    const email = admin.email;
    const phoneNumber = admin.phoneNumber;

    const anyAdmin = await prisma.admin.findMany({});

    if (anyAdmin.length > 0) {
      return NextResponse.json(
        createResponse(false, "Admin already exist", null),
        { status: 400 }
      );
    }
    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: admin.email }, { phoneNumber: admin.phoneNumber }],
      },
    });

    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [{ email: admin.email }, { phoneNumber: admin.phoneNumber }],
      },
    });
    // if (existingDentist || existingPatient) {
    //   return NextResponse.json(
    //     createResponse(false, "User data already exists", null),
    //     { status: 400 }
    //   );
    // }

    const conflicts: string[] = [];

    if (existingDentist) {
      if (existingDentist.email === email) conflicts.push("email");
      if (existingDentist.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    if (existingPatient) {
      if (existingPatient.email === email) conflicts.push("email");
      if (existingPatient.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    const uniqueConflicts = Array.from(new Set(conflicts));

    if (uniqueConflicts.length > 0) {
      return NextResponse.json(
        createResponse(
          false,
          `These fields are already in use: ${uniqueConflicts.join(", ")}`,
          null
        ),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const newPatient = await prisma.admin.create({
      data: {
        ...admin,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      createResponse(true, "Admin registered successfully", newPatient),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating admin ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const adminId = token.sub;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(createResponse(false, "No Admin found", null), {
        status: 404,
      });
    }

    const partialAdmin = await req.json();

    const email = partialAdmin.email;
    const phoneNumber = partialAdmin.phoneNumber;

    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });

    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });

    // if (existingDentist || existingPatient) {
    //   return NextResponse.json(
    //     createResponse(false, "User data already exists", null),
    //     { status: 400 }
    //   );
    // }

    const conflicts: string[] = [];

    if (existingDentist) {
      if (existingDentist.email === email) conflicts.push("email");
      if (existingDentist.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    if (existingPatient) {
      if (existingPatient.email === email) conflicts.push("email");
      if (existingPatient.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    const uniqueConflicts = Array.from(new Set(conflicts));

    if (uniqueConflicts.length > 0) {
      return NextResponse.json(
        createResponse(
          false,
          `These fields are already in use: ${uniqueConflicts.join(", ")}`,
          null
        ),
        { status: 400 }
      );
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: partialAdmin,
    });

    return NextResponse.json(
      createResponse(true, "Admin is updated successfully", updatedAdmin),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updated Admin", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
