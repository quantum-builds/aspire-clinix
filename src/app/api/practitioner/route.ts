import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import { getPractitioners, gettPractitionerById } from "@/dentallyHelpers/practitioners";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json(createResponse(false, "Unauthorized", null), {
                status: 401,
            });
        }

        if (token.role === TokenRoles.PRACTITIONER) {
            const practitionerId = token.sub ?? "";

            const respose = await gettPractitionerById(practitionerId)
            if (respose.isError) {
                return respose.response
            }
            const practitioner = respose.response

            if (!practitioner) {
                return NextResponse.json(
                    createResponse(false, "No Practitioner found", null),
                    { status: 404 }
                );
            }

            return NextResponse.json(
                createResponse(true, "Practitioner fetched successfully", practitioner),
                { status: 200 }
            );
        } else if (token.role === TokenRoles.ADMIN) {
            const { searchParams } = new URL(req.url)

            // site_id can be single OR array
            const siteIds = searchParams.getAll("site_id[]")
            const singleSiteId = searchParams.get("site_id")

            const createdAfter = searchParams.get("created_after")
            const updatedAfter = searchParams.get("updated_after")


            const respose = await getPractitioners(siteIds, singleSiteId, createdAfter, updatedAfter)
            if (respose.isError) {
                return respose.response
            }
            const practitioners = respose.response

            if (!practitioners || practitioners.length < 1) {
                return NextResponse.json(
                    createResponse(false, "No Practitioner found", practitioners),
                    { status: 404 }
                );
            }

            return NextResponse.json(
                createResponse(true, "Practitioners fetched successfully", practitioners),
                { status: 200 }
            );
        } else {
            return NextResponse.json(createResponse(false, "Forbidden", null), {
                status: 403,
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(createResponse(false, errorMessage, null), {
            status: 500,
        });
    }
}