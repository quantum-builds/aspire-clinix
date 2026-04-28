import { ApiMethods } from "@/constants/ApiMethods";
import { UserRoles } from "@/constants/UserRoles";
import { NextResponse, NextRequest } from "next/server";
import { createPatient, getPatient } from "@/dentallyHelpers/patient";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: patient@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               role:
 *                 type: string
 *                 enum: [DENTIST, PATIENT]
 *                 example: PATIENT
 *               title:
 *                 type: string
 *                 example: Mr
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               mobilePhone:
 *                 type: string
 *                 example: "+447700900123"
 *               addressLine1:
 *                 type: string
 *                 example: 10 High Street
 *               postCode:
 *                 type: string
 *                 example: SW1A 1AA
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed or patient lookup/create failed
 *       404:
 *         description: No account found
 *       409:
 *         description: Multiple matching accounts found
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  const { email, password, role } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { message: "Email, password and role are required" },
      { status: 400 },
    );
  }

  // console.log(role);
  if (role !== UserRoles.DENTIST && role !== UserRoles.PATIENT) {
    return NextResponse.json({ messsage: "Role is invalid" }, { status: 400 });
  }

  try {
    // const existingUser = await prisma.user.findUnique({
    //   where: { email: email },
    // });

    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: "Email is already in use" },
    //     { status: 400 }
    //   );
    // }

    // const hashedPassword = await hashPassword(password);

    // const newUser = await prisma.user.create({
    //   data: {
    //     email: email,
    //     password: hashedPassword,
    //     role: role,
    //   },
    // });

    // // console.log(newUser);
    // if (newUser.role === UserRoles.DENTIST) {
    //   await prisma.dentist.create({
    //     data: {
    //       userId: newUser.id,
    //       email: newUser.email,
    //     },
    //   });
    // } else if (newUser.role === UserRoles.PATIENT) {
    //   await prisma.patient.create({
    //     data: {
    //       userId: newUser.id,
    //       email: newUser.email,
    //     },
    //   });
    // } else if (newUser.role === UserRoles.ADMIN) {
    //   await prisma.admin.create({
    //     data: {
    //       userId: newUser.id,
    //       email: newUser.email,
    //     },
    //   });
    // }

    if (role === UserRoles.PATIENT) {
      const {
        title,
        firstName,
        lastName,
        mobilePhone,
        email,
        addressLine1,
        postCode,
        dateOfBirth,
      } = await req.json();

      const response = await getPatient({
        firstName,
        lastName,
        mobilePhone,
        dateOfBirth,
      });
      if (response.isError)
        return NextResponse.json(
          { message: "Failed to get patient" },
          { status: 400 },
        );
      const activePatients = response.response.filter(
        (res: any) => res.active && !res.archived_reason,
      );

      if (activePatients.length === 0)
        return NextResponse.json(
          { message: "No Account Found" },
          { status: 404 },
        );

      if (activePatients.length > 1)
        return NextResponse.json(
          { message: "No Account Found" },
          { status: 409 },
        );

      const createRes = await createPatient({
        title,
        firstName,
        lastName,
        mobilePhone,
        email,
        addressLine1,
        postCode,
        dateOfBirth,
      });
      if (createRes.isError)
        return NextResponse.json(
          { message: "Failed to create patient" },
          { status: 400 },
        );
    } else {
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
