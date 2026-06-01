import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatient } from "@/dentallyHelpers/patient";
import { getPractitioners } from "@/dentallyHelpers/practitioners";
import { capitalize } from "@/utils/formatWords";
// removed external dentally helpers; uniqueness checks restricted to Admin table

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
    const fullName = admin.fullName;

    if (!email || !phoneNumber || !fullName) {
      return NextResponse.json(
        createResponse(
          false,
          "Email, phone number, and full name are required.",
          null,
        ),
        { status: 400 },
      );
    }

    const anyAdmin = await prisma.admin.findMany({});

    if (anyAdmin.length > 0) {
      return NextResponse.json(
        createResponse(false, "Admin already exist", null),
        { status: 400 },
      );
    }
    const existingDbDentist = await prisma.dentist.findFirst({
      where: { email: email },
    });
    const existingDbPatient = await prisma.patient.findFirst({
      where: { OR: [{ email }, { mobileNumber: phoneNumber }] },
    });
    const response = await getPatient({
      emailAddress: email,
      mobilePhone: phoneNumber,
    });

  if (response.isError) {
        return NextResponse.json(
          createResponse(false, "Failed to get response from dentally", null),
          { status: 400 },
        );
      }
    const existingPatient = respose.response.patients ?? [];

    const practitionersResponse = await getPractitioners();
   if (practitionersResponse.isError) {
        return NextResponse.json(
          createResponse(false, "Failed to get response from dentally", null),
          { status: 400 },
        );
      }
    const practitioners = practitionersResponse.response.practitioners ?? [];
    const existingPractitioner = practitioners.find(
      (p: any) => p.user.email === email || p.user.mobilePhone === phoneNumber,
    );

    if (
      existingDbDentist ||
      existingDbPatient ||
      existingPatient.length > 0 ||
      existingPractitioner
    ) {
      return NextResponse.json(
        createResponse(false, `Email or Phone Number already registered`, null),
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const normalizedFullName = capitalize(admin.fullName.trim());

    const newPatient = await prisma.admin.create({
      data: {
        ...admin,
        fullName: normalizedFullName,
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
    const payload = await req.json();
    const { fullName, email, phoneNumber, fileUrl } = payload as {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      fileUrl?: string;
    };

    if (!fullName && !email && !phoneNumber && !fileUrl) {
      return NextResponse.json(
        createResponse(
          false,
          "At least one field is required to update.",
          null,
        ),
        { status: 400 },
      );
    }

    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return NextResponse.json(createResponse(false, "No Admin found", null), {
        status: 404,
      });
    }

    // Check uniqueness only within Admin table
    if (email && email !== admin.email) {
      const isExist = await prisma.admin.findFirst({ where: { email } });
      if (isExist) {
        return NextResponse.json(
          createResponse(false, "Email already registered", null),
          { status: 400 },
        );
      }
    }

    const updated = await prisma.admin.update({
      where: { id: adminId },
      data: {
        ...(fullName ? { fullName } : {}),
        ...(email ? { email } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(fileUrl ? { fileUrl } : {}),
      },
    });

    return NextResponse.json(
      createResponse(true, "Admin updated successfully", updated),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updating admin ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
