import cloudinary from "@/config/cloudinary-config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: "aspire_dental_videos/",
      resource_type: "video",
    });

    return NextResponse.json({ videos: result.resources, status: 200 });
  } catch (err) {
    console.error("Error fetching videos:", err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
