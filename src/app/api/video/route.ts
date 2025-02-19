import cloudinary from "@/config/cloudinary-config";
import { ApiMethods } from "@/constants/ApiMethods";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Method not allowed." },
      { status: 405 }
    );
  }

  try {
    const { fileContent } = await request.json();

    const uploadedFile = await cloudinary.v2.uploader.upload(
      `data:video/mp4;base64,${fileContent}`,
      {
        resource_type: "video",
        folder: "aspire_dental_videos",
      }
    );

    console.log("Uploaded file:", uploadedFile);

    return NextResponse.json({ url: uploadedFile.secure_url, status: 200 });
  } catch (err) {
    console.error("Error in file uploading:", err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
