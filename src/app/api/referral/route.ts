import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ApiMethods } from "@/constants/apiMethods";

export async function POST(req:NextRequest){

  if(req.method!==ApiMethods.POST){
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    )
  }

  const referrelForm=await req.json()

  try{
      await prisma.referralForm.create({
        data: referrelForm,
      });

      return NextResponse.json(
        {message:"Form created successfully."},
        {status:201}
      )
  }catch(error){
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}