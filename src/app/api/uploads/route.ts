import s3 from "@/config/s3-config";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/uploads:
 *   get:
 *     summary: Get signed URLs for media files or list all media
 *     tags: [Uploads]
 *     parameters:
 *       - in: query
 *         name: fileName
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: File names to generate signed URLs for (optional, supports multiple values)
 *     responses:
 *       200:
 *         description: Media URLs retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               media:
 *                 - fileName: "uploads/aspire-clinic/images/sample.jpg"
 *                   url: "https://bucket.s3.amazonaws.com/uploads/aspire-clinic/images/sample.jpg?X-Amz-Signature=..."
 *                   type: "image"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to fetch media"
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  try {
    const fileNames: string[] = searchParams.getAll("fileName");

    if (fileNames.length > 0) {
      // Batch generate signed URLs
      console.log("Generating batch signed URLs...");
      const mediaUrls = await Promise.all(
        fileNames.map(async (fileName: string) => {
          const ext = fileName.split(".").pop()?.toLowerCase() || "";
          let responseContentType: string | undefined;
          if ([".mp4", ".mov", ".avi", ".mkv"].includes(`.${ext}`)) {
            responseContentType = "video/mp4";
          } else if ([".jpg", ".jpeg"].includes(`.${ext}`)) {
            responseContentType = "image/jpeg";
          } else if (ext === "png") {
            responseContentType = "image/png";
          } else if (ext === "gif") {
            responseContentType = "image/gif";
          } else if (ext === "webp") {
            responseContentType = "image/webp";
          } else if (ext === "svg") {
            responseContentType = "image/svg+xml";
          } else if (ext === "pdf") {
            responseContentType = "application/pdf";
          } else if ([".doc", ".docx"].includes(`.${ext}`)) {
            responseContentType = "application/msword";
          }

          const commandParams: {
            Bucket: string;
            Key: string;
            ResponseContentType?: string;
          } = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName,
          };
          if (responseContentType) {
            commandParams.ResponseContentType = responseContentType;
          }
          const command = new GetObjectCommand(commandParams);
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          return { url, fileName };
        }),
      );

      return NextResponse.json(
        { success: true, media: mediaUrls },
        { status: 200 },
      );
    } else {
      // List all media files
      const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Prefix: "uploads/aspire-clinic",
      });

      const { Contents } = await s3.send(command);

      if (!Contents || Contents.length === 0) {
        console.log("No media files found.");
        return NextResponse.json({ success: true, media: [] }, { status: 200 });
      }

      // File extensions by category
      const videoExtensions = [".mp4", ".mov", ".avi", ".mkv"];
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      const pdfExtensions = [".pdf"];
      const wordExtensions = [".doc", ".docx"];

      const allExtensions = [
        ...videoExtensions,
        ...imageExtensions,
        ...pdfExtensions,
        ...wordExtensions,
      ];

      // Filter files by allowed extensions
      const mediaFiles = Contents.filter((file) =>
        allExtensions.some((ext) => file.Key?.toLowerCase().endsWith(ext)),
      );

      // Generate signed URLs
      console.log("Fetching signed URLs for media files...");
      const mediaUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          const ext = file.Key!.split(".").pop()?.toLowerCase() || "";
          let responseContentType: string | undefined;
          if ([".mp4", ".mov", ".avi", ".mkv"].includes(`.${ext}`)) {
            responseContentType = "video/mp4";
          } else if ([".jpg", ".jpeg"].includes(`.${ext}`)) {
            responseContentType = "image/jpeg";
          } else if (ext === "png") {
            responseContentType = "image/png";
          } else if (ext === "gif") {
            responseContentType = "image/gif";
          } else if (ext === "webp") {
            responseContentType = "image/webp";
          } else if (ext === "svg") {
            responseContentType = "image/svg+xml";
          } else if (ext === "pdf") {
            responseContentType = "application/pdf";
          } else if ([".doc", ".docx"].includes(`.${ext}`)) {
            responseContentType = "application/msword";
          }

          const commandParams: {
            Bucket: string;
            Key: string;
            ResponseContentType?: string;
          } = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: file.Key!,
          };
          if (responseContentType) {
            commandParams.ResponseContentType = responseContentType;
          }

          const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand(commandParams),
            { expiresIn: 3600 },
          );

          let type = "other";
          if (
            videoExtensions.some((ext) => file.Key?.toLowerCase().endsWith(ext))
          )
            type = "video";
          else if (
            imageExtensions.some((ext) => file.Key?.toLowerCase().endsWith(ext))
          )
            type = "image";
          else if (
            pdfExtensions.some((ext) => file.Key?.toLowerCase().endsWith(ext))
          )
            type = "pdf";
          else if (
            wordExtensions.some((ext) => file.Key?.toLowerCase().endsWith(ext))
          )
            type = "word";

          return {
            fileName: file.Key,
            url: signedUrl,
            type,
          };
        }),
      );

      console.log("Media file URLs generated.");
      return NextResponse.json(
        { success: true, media: mediaUrls },
        { status: 200 },
      );
    }
  } catch (error) {
    // console.error("Error fetching media:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch media" },
      { status: 500 },
    );
  }
}
