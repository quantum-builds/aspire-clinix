import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/resources/{id}:
 *   patch:
 *     summary: Update a resource
 *     tags: [Resources]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Resource title
 *               fileUrl:
 *                 type: string
 *                 description: Public URL for the resource file
 *               fileType:
 *                 type: string
 *                 enum: [PDF, VIDEO]
 *                 description: Type of the resource
 *             example:
 *               title: "Root Canal Guide"
 *               fileUrl: "https://example.com/resources/root-canal-guide.pdf"
 *               fileType: PDF
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Resource updated successfully."
 *               data: null
 *       400:
 *         description: Invalid Resource Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Resource Id."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID (CUID)
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Resource deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Resource Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Resource Id."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: Resource does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Resource with this Id does not exist."
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
export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "admin") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const resourceId = req.nextUrl.pathname.split("/").pop();

    if (!resourceId || !isValidCuid(resourceId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Resource Id.", null),
        { status: 400 },
      );
    }

    const updatedResource = await req.json();

    await prisma.resource.update({
      where: { id: resourceId },
      data: updatedResource,
    });

    return NextResponse.json(
      createResponse(true, "Resource updated successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updating resource ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const resourceId = req.nextUrl.pathname.split("/").pop();

    if (!resourceId || !isValidCuid(resourceId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Resource Id.", null),
        { status: 400 },
      );
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        createResponse(false, "Resource with this Id does not exist.", null),
        { status: 404 },
      );
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return NextResponse.json(
      createResponse(true, "Resource deleted successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in deleting resource ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
