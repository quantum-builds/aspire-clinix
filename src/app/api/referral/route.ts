import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ApiMethods } from "@/constants/ApiMethods";

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const referralForm = await req.json();

  try {
    console.log(referralForm);

    await prisma.referralForm.create({
      data: referralForm,
    });

    return NextResponse.json(
      { message: "Form created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
