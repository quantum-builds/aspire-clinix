import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";
import { createResponse } from "@/utils/createResponse";

export async function POST(req: NextRequest) {
  const referralForm = await req.json();

  try {
    // const { dentistId, patientId } = referralForm;

    // TODO

    // console.log(dentistId + " " + patientId);

    // if (!isValidCuid(dentistId) || !isValidCuid(patientId)) {
    //   return NextResponse.json(
    //     { message: "Invalid patient or dentist Id." },
    //     { status: 400 }
    //   );
    // }

    // const dentist = await prisma.dentist.findUnique({
    //   where: { id: dentistId },
    // });

    // if (!dentist) {
    //   return NextResponse.json(
    //     { message: "This doctor does not exists." },
    //     { status: 404 }
    //   );
    // }

    // const patient = await prisma.dentist.findUnique({
    //   where: { id: patientId },
    // });

    // if (!patient) {
    //   return NextResponse.json(
    //     { message: "This patient does not exists." },
    //     { status: 404 }
    //   );
    // }

    await prisma.referralForm.create({
      data: referralForm,
    });

    return NextResponse.json(
      createResponse(true, "Form created successfully.", null),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating referral form ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

// export async function GET(req: NextRequest) {
//   const searchParams = req.nextUrl.searchParams;

//   try {
//     const dentistId = searchParams.get("dentistId");
//     // TODO Add is valid cuid
//     if (!dentistId) {
//       return NextResponse.json(
//         { message: "Invalid Dentist Id." },
//         { status: 400 }
//       );
//     }

//     const referralForms = await prisma.referralForm.findMany({
//       where: { dentistId: dentistId },
//       // include: { Dentist: true, Patient: true },
//     });

//     if (referralForms.length === 0) {
//       return NextResponse.json(
//         { message: "Dentist don't have any referrel form" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "Referral forms fetched successfully.",
//         data: referralForms,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
