import cloudinary from "@/config/cloudinary-config";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get a specific video by ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               videos:
 *                 - public_id: "aspire_dental_videos/sample"
 *                   secure_url: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
 *               status: 200
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *               status: 500
 *   delete:
 *     summary: Delete a video from Cloudinary and database
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Video deleted successfully."
 *       400:
 *         description: Invalid video ID
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid video ID."
 *       404:
 *         description: Video not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Video not found."
 *               status: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 *               status: 500
 */
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
      },
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
      { status: 200 },
    );
  } catch (err) {
    console.error("Error deleting video:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
