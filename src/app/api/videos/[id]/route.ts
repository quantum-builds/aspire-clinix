import cloudinary from "@/config/cloudinary-config";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.pathname.split("/").pop();
  try {
    const video = await prisma.video.findUnique({ where: { id: videoId } });

    if (!video) {
      return NextResponse.json({ message: "No data for this id", status: 200 });
    }

    const fileDataJson = {
      fileName: video.fileName,
      fileType: video.fileType,
      fileContent: video.fileContent,
    };
    const result = await cloudinary.v2.api.resource(
      `aspire_dental_videos/${fileDataJson}`,
      {
        resource_type: "video",
      }
    );

    return NextResponse.json({ videos: result.resources, status: 200 });
  } catch (err) {
    console.error("Error fetching videos:", err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const videoId = request.nextUrl.pathname.split("/").pop();

  if (!videoId) {
    return NextResponse.json({ message: "Invalid video ID." }, { status: 400 });
  }

  try {
    const video = await prisma.video.findUnique({ where: { id: videoId } });

    if (!video) {
      return NextResponse.json({ message: "Video not found.", status: 404 });
    }

    // Extract Cloudinary public_id (assuming it's stored in `video.fileName`)
    const publicId = `aspire_dental_videos/${video.fileName}`;

    // Delete video from Cloudinary
    await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });

    // Delete video from database
    await prisma.video.delete({ where: { id: videoId } });

    return NextResponse.json(
      { message: "Video deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting video:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
