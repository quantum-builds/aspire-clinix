import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { hashPassword } from "@/utils/passwordUtils";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { email, password,role } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { message: "Email, password and role are required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        role:role,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
