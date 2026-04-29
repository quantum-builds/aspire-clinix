import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import {
  getPractitioners,
  gettPractitionerById,
} from "@/dentallyHelpers/practitioners";

/**
 * @swagger
 * /api/practitioner:
 *   get:
 *     summary: Get practitioner data
 *     tags: [Practitioner]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Practitioner fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Practitioner fetched successfully"
 *               data:
 *                 id: "prac_01HXYZ1234ABCDE"
 *                 dentallyId: "dent_01HXYZ1234ABCDE"
 *                 email: "dentist@example.com"
 *                 gdcNo: "GDC123456"
 *                 firstName: "Sarah"
 *                 lastName: "Ahmed"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No practitioner found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Practitioner found"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 */
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

      const respose = await gettPractitionerById(practitionerId);
      if (respose.isError) {
        return respose.response;
      }
      const practitioner = respose.response;

      if (!practitioner) {
        return NextResponse.json(
          createResponse(false, "No Practitioner found", null),
          { status: 404 },
        );
      }

      return NextResponse.json(
        createResponse(true, "Practitioner fetched successfully", practitioner),
        { status: 200 },
      );
    } else if (token.role === TokenRoles.ADMIN) {
      // const { searchParams } = new URL(req.url)
      // // site_id can be single OR array
      // const siteIds = searchParams.getAll("site_id[]")
      // const singleSiteId = searchParams.get("site_id")
      // const createdAfter = searchParams.get("created_after")
      // const updatedAfter = searchParams.get("updated_after")
      // const respose = await getPractitioners(siteIds, singleSiteId, createdAfter, updatedAfter)
      // if (respose.isError) {
      //     return respose.response
      // }
      // const practitioners = respose.response
      // if (!practitioners || practitioners.length < 1) {
      //     return NextResponse.json(
      //         createResponse(false, "No Practitioner found", practitioners),
      //         { status: 404 }
      //     );
      // }
      // return NextResponse.json(
      //     createResponse(true, "Practitioners fetched successfully", practitioners),
      //     { status: 200 }
      // );
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
