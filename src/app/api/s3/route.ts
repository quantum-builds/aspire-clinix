import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "@/config/s3-config";

/**
 * @swagger
 * /api/s3:
 *   get:
 *     summary: Get signed URL for S3 file upload
 *     tags: [S3]
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to upload
 *       - in: query
 *         name: fileType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [images, video, pdf]
 *         description: Type of file (images, video, or pdf)
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *       400:
 *         description: Missing file details (fileName or fileType)
 *       500:
 *         description: Failed to generate signed URL
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const fileName = searchParams.get("fileName");
    const fileType = searchParams.get("fileType"); // images, video, pdf

    console.log("in api ", fileType);
    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, message: "Missing file details" },
        { status: 400 },
      );
    } // Map fileType to folder
    let folder = "";
    console.log("file type is ", fileType);
    switch (fileType.toLowerCase()) {
      case "images":
        folder = "uploads/aspire-clinic/images";
        break;
      case "video":
        folder = "uploads/aspire-clinic/videos";
        break;
      case "pdf":
        folder = "uploads/aspire-clinic/letters";
        break;
      default:
        folder = "uploads/aspire-clinic/others"; // fallback
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${folder}/${fileName}`,
      ContentType: fileType,
    };
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return NextResponse.json({ success: true, url: signedUrl });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate URL" },
      { status: 500 },
    );
  }
}
