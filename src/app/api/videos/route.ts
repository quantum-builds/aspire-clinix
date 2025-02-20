import cloudinary from "@/config/cloudinary-config";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const patientId = request.nextUrl.searchParams.get("patientId");

    if (patientId) {
      // Fetch videos for a specific patient
      const videos = await prisma.video.findMany({
        where: { patientId: patientId },
      });

      const result = await Promise.all(
        videos.map(async (video) => {
          try {
            const cloudinaryResult = await cloudinary.v2.api.resource(
              `aspire_dental_videos/${video.fileName}`,
              { resource_type: "video" }
            );
            return cloudinaryResult;
          } catch (cloudinaryError) {
            console.error("Error fetching from Cloudinary:", cloudinaryError);
            return null; // Handle individual errors gracefully
          }
        })
      );

      return NextResponse.json({ videos: result.filter(Boolean), status: 200 });
    } else {
      // Fetch all videos if no patientId is provided
      const result = await cloudinary.v2.api.resources({
        type: "upload",
        prefix: "aspire_dental_videos/",
        resource_type: "video",
      });

      return NextResponse.json({ videos: result.resources, status: 200 });
    }
  } catch (err) {
    console.error("Error fetching videos:", err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      fileContent: fileDataJson,
      patientId,
      dentistId,
    } = await request.json();

    const uploadedFile = await cloudinary.v2.uploader.upload(
      `data:video/mp4;base64,${fileDataJson}`,
      {
        resource_type: "video",
        folder: "aspire_dental_videos",
      }
    );

    await prisma.video.create({
      data: {
        patientId: patientId,
        dentistId: dentistId,
        fileContent: fileDataJson.fileContent,
        fileName: fileDataJson.fileName,
        fileType: fileDataJson.fileType,
      },
    });

    console.log("Uploaded file:", uploadedFile);

    return NextResponse.json({ url: uploadedFile.secure_url, status: 200 });
  } catch (err) {
    console.error("Error in file uploading:", err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
