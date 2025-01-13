import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ReferralForm } from "@prisma/client";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";

function verifyUserAccess(userId: string, updatedReferralForm: ReferralForm) {
  if (userId === updatedReferralForm.id) {
    return true;
  } else {
    return false;
  }
}

export async function GET(req: NextRequest){
  if(req.method!==ApiMethods.GET){
    return NextResponse.json(
      {message:"Methond not allowed."},
      {status:405}
    )
  }

  const referralFormId = req.nextUrl.searchParams.get("id");

  
  try{
      if(!referralFormId || !isValidCuid(referralFormId)){
        return NextResponse.json(
          { message: "Invalid Form Id." },
          { status: 400}
        );
      }
      
      const referralForm = await prisma.referralForm.findUnique({
        where: { id: referralFormId },
      });

      if(!referralForm){
        return NextResponse.json(
          {message:"Referral form with this Id does not exists."},
          {status: 404}
        )
      }

      return NextResponse.json(
        {
          message:"Referral form fetched successfully.",
          data:referralForm
        },
        {status:200}
      )
  }catch(err){
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

}

export async function PUT(req:NextRequest){
  if (req.method !== ApiMethods.PUT) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const referralFormId = req.nextUrl.searchParams.get("id");

  if (!referralFormId || !isValidCuid(referralFormId)) {
    return NextResponse.json({ message: "Invalid Form Id." }, { status: 400 });
  }

  //   const accessToken = getAccessTokenFromCookies(req);
  //   if (!accessToken) {
  //     return res
  //       .status(401)
  //       .json({ message: "You are not authorized to perform this action" });
  //   }

  //   const userId = verifyToken(accessToken);
  //   if (!userId) {
  //     return res.status(401).json({
  //       message: "You are not authorized to perform this action",
  //     });
  //   }

  //   const updatedReferralForm: ReferralForm = req.body;
  //   if (verifyUserAccess(userId as string, updatedReferralForm)) {
  //     await prisma.referralForm.update({
  //       where: { id: referralFormId },
  //       data: updatedReferralForm,
  //     });
  //     return res
  //       .status(200)
  //       .json({ message: "Referral form updated succcessfully" });
  //   } else {
  //     return res.status(401).json({
  //       message: "You are not authorized to perform this action",
  //     });
  //   }
  
  const updateReferralForm=req.json()

  try{
    await prisma.referralForm.update({
      where: { id: referralFormId },
      data: updateReferralForm,
    });

    return NextResponse.json(
      {message:"Referral form updated successfully."},
      {status:200}
    )
  }catch(error){
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

}