import { axiosInstance } from "@/config/api-config";

export interface S3File {
  fileName: string;
  url: string;
  type: string;
  contentType: string;
  size: number;
  lastModified: string | null;
}

export interface S3FilesResponse {
  success: boolean;
  files: S3File[];
  isTruncated: boolean;
  totalCount: number;
}

/**
 * Fetches all files from S3 bucket
 * @param prefix - Optional prefix/path to filter files (e.g., "uploads/aspire-clinic/images")
 * @param limit - Maximum number of files to return (default: 100)
 * @returns Promise with files data
 */
export async function getAllS3Files(
  prefix?: string,
  limit?: number
): Promise<S3FilesResponse> {
  try {
    const params = new URLSearchParams();
    if (prefix) params.append("prefix", prefix);
    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = `/api/s3-files${queryString ? `?${queryString}` : ""}`;

    const response = await axiosInstance.get<S3FilesResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching S3 files:", error);
    throw error;
  }
}

/**
 * Fetches files from a specific folder
 * @param folder - Folder name (e.g., "images", "videos", "letters")
 * @param limit - Maximum number of files to return
 * @returns Promise with files data
 */
export async function getS3FilesByFolder(
  folder: "images" | "videos" | "letters" | "pdf" | "others",
  limit?: number
): Promise<S3FilesResponse> {
  const prefix = `uploads/aspire-clinic/${folder}`;
  return getAllS3Files(prefix, limit);
}
