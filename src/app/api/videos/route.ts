import cloudinary from "@/config/cloudinary-config";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get videos for a patient or all videos
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *         description: Patient ID to fetch videos for (optional)
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
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
 *   post:
 *     summary: Upload a video to Cloudinary and save to database
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileDataJson
 *               - patientId
 *               - dentistId
 *             properties:
 *               fileDataJson:
 *                 type: object
 *                 properties:
 *                   fileContent:
 *                     type: string
 *                     description: Base64 encoded file content
 *                   fileName:
 *                     type: string
 *                   fileType:
 *                     type: string
 *               patientId:
 *                 type: string
 *               dentistId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               url: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
 *               status: 200
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *               status: 500
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const patientId = searchParams.get("patientId");
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
              { resource_type: "video" },
            );
            return cloudinaryResult;
          } catch (cloudinaryError) {
            console.error("Error fetching from Cloudinary:", cloudinaryError);
            return null; // Handle individual errors gracefully
          }
        }),
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
    const { fileDataJson, patientId, dentistId } = await request.json();

    console.log("file content is ", fileDataJson);
    const uploadedFile = await cloudinary.v2.uploader.upload(
      `data:video/mp4;base64,${fileDataJson.fileContent}`,
      {
        resource_type: "video",
        folder: "aspire_dental_videos",
      },
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
