import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "@/config/s3-config";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const fileName = searchParams.get("fileName");
    const fileType = searchParams.get("fileType"); // images, video, pdf

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, message: "Missing file details" },
        { status: 400 }
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
        folder = "uploads/aspire-clinic/pdfs";
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
      { status: 500 }
    );
  }
}
