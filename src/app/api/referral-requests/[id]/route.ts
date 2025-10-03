import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { Prisma, ReferralRequestStatus } from "@prisma/client";
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
      include: { assignedDentist: true, referralForm: true, appointment: true },
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
