import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatient } from "@/dentallyHelpers/patient";

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Get the authenticated admin profile
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin record successfully fetched
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Admin record successfully fetched"
 *               data:
 *                 id: "ckv9qk2xw0001s2v1b1b2c3d4"
 *                 fullName: "Jane Doe"
 *                 password: "$2a$10$kGk3g6n9vH9G2s6r9qg0cO8pYxL7N5rO1aX3r2s4f5g6h7i8j9k0"
 *                 email: "admin@example.com"
 *                 phoneNumber: "+447700900123"
 *                 fileUrl: "https://example.com/admins/jane.png"
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No admin found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Admin found"
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
 *     summary: Create the admin account
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phoneNumber
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Admin registered successfully"
 *               data:
 *                 id: "ckv9qk2xw0001s2v1b1b2c3d4"
 *                 fullName: "Jane Doe"
 *                 password: "$2a$10$kGk3g6n9vH9G2s6r9qg0cO8pYxL7N5rO1aX3r2s4f5g6h7i8j9k0"
 *                 email: "admin@example.com"
 *                 phoneNumber: "+447700900123"
 *                 fileUrl: "https://example.com/admins/jane.png"
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:00:00.000Z"
 *       400:
 *         description: Admin already exist or fields already in use
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "These fields are already in use: email, phone number"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   patch:
 *     summary: Update the authenticated admin profile
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin is updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Admin is updated successfully"
 *               data:
 *                 id: "ckv9qk2xw0001s2v1b1b2c3d4"
 *                 fullName: "Jane Doe"
 *                 password: "$2a$10$kGk3g6n9vH9G2s6r9qg0cO8pYxL7N5rO1aX3r2s4f5g6h7i8j9k0"
 *                 email: "admin@example.com"
 *                 phoneNumber: "+447700900123"
 *                 fileUrl: "https://example.com/admins/jane.png"
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:00:00.000Z"
 *       400:
 *         description: Validation failed or fields already in use
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "These fields are already in use: email"
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No admin found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Admin found"
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
      { status: 200 },
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
        { status: 400 },
      );
    }
    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: admin.email }, { phoneNumber: admin.phoneNumber }],
      },
    });

    const respose = await getPatient({
      emailAddress: email,
      mobilePhone: phoneNumber,
    });
    if (respose.isError) {
      return respose.response;
    }
    const existingPatient = respose.response;
    // if (existingDentist || existingPatient) {
    //   return NextResponse.json(
    //     createResponse(false, "User data already exists", null),
    //     { status: 400 }
    //   );
    // }

    const conflicts: string[] = [];

    if (existingDentist) {
      if (existingDentist.email === email) conflicts.push("email");
      if (existingDentist.phoneNumber === phoneNumber)
        conflicts.push("phone number");
    }

    if (existingPatient) {
      if (existingPatient.email === email) conflicts.push("email");
      if (existingPatient.mobilePhone === phoneNumber)
        conflicts.push("phone number");
    }

    const uniqueConflicts = Array.from(new Set(conflicts));

    if (uniqueConflicts.length > 0) {
      return NextResponse.json(
        createResponse(
          false,
          `These fields are already in use: ${uniqueConflicts.join(", ")}`,
          null,
        ),
        { status: 400 },
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
      { status: 201 },
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

    const respose = await getPatient({
      emailAddress: email,
      mobilePhone: phoneNumber,
    });
    if (respose.isError) {
      return respose.response;
    }
    const existingPatient = respose.response;

    // if (existingDentist || existingPatient) {
    //   return NextResponse.json(
    //     createResponse(false, "User data already exists", null),
    //     { status: 400 }
    //   );
    // }

    const conflicts: string[] = [];

    if (existingDentist) {
      if (existingDentist.email === email) conflicts.push("email");
      if (existingDentist.phoneNumber === phoneNumber)
        conflicts.push("phone number");
    }

    if (existingPatient) {
      if (existingPatient.email === email) conflicts.push("email");
      if (existingPatient.mobilePhone === phoneNumber)
        conflicts.push("phone number");
    }

    const uniqueConflicts = Array.from(new Set(conflicts));

    if (uniqueConflicts.length > 0) {
      return NextResponse.json(
        createResponse(
          false,
          `These fields are already in use: ${uniqueConflicts.join(", ")}`,
          null,
        ),
        { status: 400 },
      );
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: partialAdmin,
    });

    return NextResponse.json(
      createResponse(true, "Admin is updated successfully", updatedAdmin),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updated Admin", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
