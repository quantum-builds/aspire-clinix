import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";

export async function GET(req:NextRequest){

  if(req.method!==ApiMethods.GET){
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    )
  }
  const dentistId=req.nextUrl.searchParams.get('id')

  try{
    if(!dentistId || !isValidCuid(dentistId)){
      return NextResponse.json(
        { message: "Invalid Dentist Id." },
        { status: 400}
      );
    }

    const referralForms = await prisma.referralForm.findMany({
      where: { referrerDentistId: dentistId },
    });

    if (!referralForms) {
      return NextResponse.json(
        { message: "Dentist don't have any referrel form" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Referral forms fetched successfully.",
        data: referralForms,
      },
      { status: 200 }
    );
  }catch(error){
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
