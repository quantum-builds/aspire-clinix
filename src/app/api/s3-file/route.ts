import s3 from "@/config/s3-config";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/s3-files:
 *   get:
 *     summary: List all files from S3 bucket with signed URLs
 *     tags: [S3]
 *     parameters:
 *       - in: query
 *         name: fileName
 *         schema:
 *           type: string
 *         description: Optional full S3 key to fetch a single file (e.g., "uploads/aspire-clinic/images/sample.jpg")
 *       - in: query
 *         name: prefix
 *         schema:
 *           type: string
 *         description: Optional prefix/path to filter files (e.g., "uploads/aspire-clinic/images")
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of files to return
 *     responses:
 *       200:
 *         description: Files retrieved successfully (when fileName is provided, files is a single object; otherwise it's an array)
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               files:
 *                 fileName: "uploads/aspire-clinic/images/sample.jpg"
 *                 url: "https://bucket.s3.amazonaws.com/uploads/aspire-clinic/images/sample.jpg?X-Amz-Signature=..."
 *                 type: "image"
 *                 size: 12345
 *                 lastModified: "2024-01-15T10:30:00.000Z"
 *       500:
 *         description: Failed to fetch files
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to fetch files"
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  try {
    const requestedFileName = searchParams.get("fileName");
    console.log("Requested fileName:", requestedFileName);
    const prefix = searchParams.get("prefix") || "uploads/aspire-clinic";
    const limit = parseInt(searchParams.get("limit") || "100", 10);


    // File extensions by category
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
      ".ico",
    ];
    const pdfExtensions = [".pdf"];
    const wordExtensions = [".doc", ".docx"];
    const excelExtensions = [".xls", ".xlsx"];
    const powerPointExtensions = [".ppt", ".pptx"];
    const textExtensions = [
      ".txt",
      ".csv",
      ".json",
      ".xml",
      ".html",
      ".css",
      ".js",
    ];
    const audioExtensions = [".mp3", ".wav", ".ogg", ".aac", ".flac"];
    const archiveExtensions = [".zip", ".rar", ".7z", ".tar", ".gz"];

    const allExtensions = [
      ...videoExtensions,
      ...imageExtensions,
      ...pdfExtensions,
      ...wordExtensions,
      ...excelExtensions,
      ...powerPointExtensions,
      ...textExtensions,
      ...audioExtensions,
      ...archiveExtensions,
    ];

    const getFileMeta = (fileName: string) => {
      const lowerName = fileName.toLowerCase();
      const ext = lowerName.split(".").pop() || "";

      // Determine content type
      let contentType = "application/octet-stream";
      if (videoExtensions.some((e) => lowerName.endsWith(e)))
        contentType = "video/mp4";
      else if (imageExtensions.some((e) => lowerName.endsWith(e))) {
        if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
        else if (ext === "png") contentType = "image/png";
        else if (ext === "gif") contentType = "image/gif";
        else if (ext === "webp") contentType = "image/webp";
        else if (ext === "svg") contentType = "image/svg+xml";
        else if (ext === "bmp") contentType = "image/bmp";
        else contentType = "image/*";
      } else if (pdfExtensions.some((e) => lowerName.endsWith(e)))
        contentType = "application/pdf";
      else if (wordExtensions.some((e) => lowerName.endsWith(e)))
        contentType =
          ext === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/msword";
      else if (excelExtensions.some((e) => lowerName.endsWith(e)))
        contentType =
          ext === "xlsx"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/vnd.ms-excel";
      else if (powerPointExtensions.some((e) => lowerName.endsWith(e)))
        contentType =
          ext === "pptx"
            ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            : "application/vnd.ms-powerpoint";
      else if (ext === "txt") contentType = "text/plain";
      else if (ext === "csv") contentType = "text/csv";
      else if (ext === "json") contentType = "application/json";
      else if (ext === "xml") contentType = "application/xml";
      else if (ext === "html") contentType = "text/html";
      else if (ext === "css") contentType = "text/css";
      else if (ext === "js") contentType = "application/javascript";
      else if (audioExtensions.some((e) => lowerName.endsWith(e))) {
        if (ext === "mp3") contentType = "audio/mpeg";
        else if (ext === "wav") contentType = "audio/wav";
        else if (ext === "ogg") contentType = "audio/ogg";
        else if (ext === "aac") contentType = "audio/aac";
        else if (ext === "flac") contentType = "audio/flac";
      }

      // Determine file type category
      let type = "other";
      if (videoExtensions.some((e) => lowerName.endsWith(e))) type = "video";
      else if (imageExtensions.some((e) => lowerName.endsWith(e)))
        type = "image";
      else if (pdfExtensions.some((e) => lowerName.endsWith(e))) type = "pdf";
      else if (wordExtensions.some((e) => lowerName.endsWith(e))) type = "word";
      else if (excelExtensions.some((e) => lowerName.endsWith(e)))
        type = "excel";
      else if (powerPointExtensions.some((e) => lowerName.endsWith(e)))
        type = "powerpoint";
      else if (textExtensions.some((e) => lowerName.endsWith(e))) type = "text";
      else if (audioExtensions.some((e) => lowerName.endsWith(e)))
        type = "audio";
      else if (archiveExtensions.some((e) => lowerName.endsWith(e)))
        type = "archive";

      return { contentType, type };
    };

    const getSignedFile = async (fileName: string) => {
      const { contentType, type } = getFileMeta(fileName);

      const commandParams: {
        Bucket: string;
        Key: string;
        ResponseContentType?: string;
      } = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
      };

      if (contentType) {
        commandParams.ResponseContentType = contentType;
      }

      const url = await getSignedUrl(s3, new GetObjectCommand(commandParams), {
        expiresIn: 3600,
      });

      // Best-effort metadata; don't fail the request if HeadObject is not allowed.
      let size = 0;
      let lastModified: string | null = null;
      try {
        const head = await s3.send(
          new HeadObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName,
          }),
        );
        size = head.ContentLength ?? 0;
        lastModified = head.LastModified?.toISOString() ?? null;
      } catch {
        // ignore
      }

      return {
        fileName,
        url,
        type,
        contentType,
        size,
        lastModified,
      };
    };

    // If fileName is provided, return a single file object
    if (requestedFileName) {
      const single = await getSignedFile(requestedFileName);
      console.log("Single file response:", single);
      return NextResponse.json(
        {
          success: true,
          files: [single],
          isTruncated: false,
          totalCount: 1,
        },
        { status: 200 },
      );
    }

    // List all files from S3
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: prefix,
      MaxKeys: limit,
    });

    const { Contents, IsTruncated } = await s3.send(command);

    if (!Contents || Contents.length === 0) {
      return NextResponse.json(
        { success: true, files: [], isTruncated: false },
        { status: 200 },
      );
    }

    // Filter and process files
    const files = await Promise.all(
      Contents.filter((file) => {
        // Skip folders (keys ending with /)
        if (file.Key?.endsWith("/")) return false;
        // Filter by allowed extensions
        return allExtensions.some((ext) =>
          file.Key?.toLowerCase().endsWith(ext),
        );
      }).map(async (file) => {
        const fileName = file.Key!;
        const { contentType, type } = getFileMeta(fileName);

        const commandParams: {
          Bucket: string;
          Key: string;
          ResponseContentType?: string;
        } = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: fileName,
        };

        if (contentType) {
          commandParams.ResponseContentType = contentType;
        }

        const signedUrl = await getSignedUrl(
          s3,
          new GetObjectCommand(commandParams),
          { expiresIn: 3600 },
        );

        return {
          fileName,
          url: signedUrl,
          type,
          contentType,
          size: file.Size || 0,
          lastModified: file.LastModified?.toISOString() || null,
        };
      }),
    );

    return NextResponse.json(
      {
        success: true,
        files,
        isTruncated: IsTruncated || false,
        totalCount: files.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching S3 files:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch files" },
      { status: 500 },
    );
  }
}