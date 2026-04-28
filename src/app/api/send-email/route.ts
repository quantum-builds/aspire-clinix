// import sendgrid from "@/config/sendgrid-config";
// import { createResponse } from "@/utils/createResponse";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const { subject, html } = await req.json();

//   if (!subject || !html) {
//     return NextResponse.json(
//       createResponse(false, "subject and text are required", null),
//       {
//         status: 400,
//       }
//     );
//   }

//   if (!process.env.EMAIL_FROM) {
//     return NextResponse.json(
//       createResponse(
//         false,
//         "EMAIL_FROM environment variable is not set. Please configure it in your environment file.",
//         null
//       ),
//       { status: 500 }
//     );
//   }

//   try {
//     await sendgrid.send({
//       from: process.env.EMAIL_FROM,
//       to: process.env.EMAIL_TO,
//       subject,
//       html,
//       text: undefined,
//     });

//     return NextResponse.json(
//       createResponse(true, "Email sent successfully!", null),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Error in sending email ", error);
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     return NextResponse.json(createResponse(false, errorMessage, null), {
//       status: 500,
//     });
//   }
// }

import sendgrid from "@/config/sendgrid-config";
import { createResponse } from "@/utils/createResponse";
import { UserRoles } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/send-email:
 *   post:
 *     summary: Send an email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - html
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               html:
 *                 type: string
 *                 description: Email body in HTML format
 *               attachment:
 *                 type: object
 *                 description: Optional email attachment
 *                 properties:
 *                   content:
 *                     type: string
 *               userType:
 *                 type: string
 *                 description: User type (ADMIN or other)
 *               recieverMail:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing required fields (subject and html)
 *       500:
 *         description: Internal Server Error or EMAIL_FROM not configured
 */
export async function POST(req: NextRequest) {
  const { subject, html, attachment, userType, recieverMail } =
    await req.json();

  if (!subject || !html) {
    return NextResponse.json(
      createResponse(false, "subject and html are required", null),
      {
        status: 400,
      },
    );
  }

  if (!process.env.EMAIL_FROM) {
    return NextResponse.json(
      createResponse(
        false,
        "EMAIL_FROM environment variable is not set. Please configure it in your environment file.",
        null,
      ),
      { status: 500 },
    );
  }

  console.log("to ", process.env.EMAIL_TO);
  console.log("to ", process.env.EMAIL_FROM);

  let emailTo = "";
  if (userType === UserRoles.ADMIN) {
    emailTo = process.env.EMAIL_TO || "";
  } else {
    emailTo = recieverMail;
  }
  try {
    const emailData: any = {
      from: process.env.EMAIL_FROM,
      to: emailTo,
      subject,
      html,
      text: undefined,
    };

    // Add attachment if provided
    if (attachment && attachment.content) {
      emailData.attachments = [
        {
          content: attachment.content,
          filename: attachment.filename,
          type: attachment.type,
          disposition: attachment.disposition,
        },
      ];
    }

    await sendgrid.send(emailData, attachment);

    return NextResponse.json(
      createResponse(true, "Email sent successfully!", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in sending email:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
