import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (
      token.role === TokenRoles.PATIENT ||
      token.role === TokenRoles.RECIEVING_DENTIST
    ) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const referralRequestId = req.nextUrl.pathname.split("/").pop();

    if (!referralRequestId || !isValidCuid(referralRequestId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Referral Request.", null),
        { status: 400 }
      );
    }
    // const { searchParams } = new URL(req.url);

    // const page = parseInt(searchParams.get("page") || "1", 10);
    // const search = searchParams.get("search") || "";
    // const on = searchParams.get("on") || "";
    // const before = searchParams.get("before") || "";
    // const after = searchParams.get("after") || "";
    // const statusParam = searchParams.get("status") || "";

    // const limit = 10;
    // const skip = (page - 1) * limit;

    // const status =
    //   statusParam &&
    //   Object.values(ReferralRequestStatus).includes(
    //     statusParam as ReferralRequestStatus
    //   )
    //     ? (statusParam as ReferralRequestStatus)
    //     : undefined;

    // let dentistId = null;
    // if (
    //   token.role === TokenRoles.DENTIST ||
    //   token.role === TokenRoles.REFERRING_DENTIST
    // ) {
    //   dentistId = token.sub;
    // }

    // let baseWhere: Prisma.ReferralRequestWhereInput = {
    //   ...(search && { id: { contains: search, mode: "insensitive" } }),
    //   ...(dentistId && { assignedDentistId: dentistId }),
    //   requestStatus: status,
    // };

    // const referralRequests = await prisma.referralRequest.findMany({
    //   where: { assignedDentistId: dentistId },
    // });

    // const [referralRequests, totalCount] = await Promise.all([
    //   prisma.referralRequest.findMany({
    //     where: baseWhere,
    //     skip,
    //     take: limit,
    //     orderBy: { createdAt: "desc" },
    //     include: { referralForm: true },
    //   }),
    //   prisma.referralRequest.count({ where: baseWhere }),
    // ]);

    const existingRequest = await prisma.referralRequest.findUnique({
      where: { id: referralRequestId },
      include: { assignedDentist: true, referralForm: true, appointment: { include: { dentist: true } } },
    });

    if (!existingRequest) {
      return NextResponse.json(
        createResponse(false, "Referral Request does not exist.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(
        true,
        "Referral request fetched successfully.",
        existingRequest
      ),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching referral request ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "FOrbidden", null), {
        status: 403,
      });
    }
    const referralRequestId = req.nextUrl.pathname.split("/").pop();
    const partialReferralRequest = await req.json();
    // const { searchParams } = new URL(req.url);
    // const patientId = searchParams.get("patientId") || "";

    if (!referralRequestId || !isValidCuid(referralRequestId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Referral Request id.", null),
        { status: 400 }
      );
    }

    const referral = await prisma.referralRequest.findUnique({
      where: { id: referralRequestId },
    });

    if (!referral) {
      return NextResponse.json(
        createResponse(false, "Referral request does not exist.", null),
        { status: 404 }
      );
    }

    const updatedReferralRequest = await prisma.referralRequest.update({
      where: { id: referralRequestId },
      data: partialReferralRequest,
    });

    return NextResponse.json(
      createResponse(
        true,
        "Referral request Updated successfully.",
        updatedReferralRequest
      ),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating referral request", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {


  const referralRequestId = req.nextUrl.pathname.split("/").pop();

  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN && token.role !== TokenRoles.DENTIST && token.role !== TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    if (!referralRequestId || !isValidCuid(referralRequestId)) {
      return NextResponse.json(
        { message: "Invalid Request Id." },
        { status: 400 }
      );
    }

    const referralRequest = await prisma.referralRequest.findUnique({
      where: { id: referralRequestId },
      include: { referralForm: true }
    });

    if (!referralRequest) {
      return NextResponse.json(
        { message: "Referral request with this Id does not exists." },
        { status: 404 }
      );
    }

    if (token.role !== TokenRoles.ADMIN && referralRequest.referralForm.referralDentistId != token.sub) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
    await prisma.$transaction(async (tx) => {
      // finally delete referral request
      await tx.referralRequest.delete({
        where: { id: referralRequestId },
      });

      // delete appointment if it exists
      if (referralRequest.appointmentId) {
        await tx.appointment.delete({
          where: { id: referralRequest.appointmentId },
        });
      }

      // delete referral form if it exists
      if (referralRequest.referralFormId) {
        await tx.referralForm.delete({
          where: { id: referralRequest.referralFormId },
        });
      }
    });

    return NextResponse.json(
      { message: "Referral deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}