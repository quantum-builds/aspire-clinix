import cloudinary from "@/config/cloudinary-config";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const patientId = request.nextUrl.pathname.split("/").pop();

  // TODO : check for if patient exists

  try {
    const videos = await prisma.video.findMany({
      where: { patientId: patientId },
    });

    const result = await Promise.all(
      videos.map(async (name) => {
        const fileDataJson = {
          fileName: name.fileName,
          fileType: name.fileType,
          fileContent: name.fileContent,
        };
        const result = await cloudinary.v2.api.resource(
          `aspire_dental_videos/${fileDataJson}`,
          {
            resource_type: "video",
          }
        );
        return result;
      })
    );

    return NextResponse.json({ result, status: 200 });
  } catch (err) {
    console.error("Error fetching videos:", err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
