"use client";

import { useState, useEffect } from "react";
import {
  getAllS3Files,
  getS3FilesByFolder,
  S3File,
} from "@/services/s3/s3FilesQuery";

// File type filter options
const FILE_TYPE_FILTERS = [
  { label: "All Files", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "PDFs", value: "pdf" },
  { label: "Word Documents", value: "word" },
  { label: "Excel Files", value: "excel" },
  { label: "PowerPoint", value: "powerpoint" },
  { label: "Text Files", value: "text" },
  { label: "Audio", value: "audio" },
  { label: "Archives", value: "archive" },
  { label: "Others", value: "other" },
] as const;

// Folder options
const FOLDER_OPTIONS = [
  { label: "All Folders", value: "all" },
  { label: "Images", value: "images" },
  { label: "Videos", value: "videos" },
  { label: "Letters/PDFs", value: "letters" },
  { label: "Others", value: "others" },
] as const;

export default function S3FilesPage() {
  const [files, setFiles] = useState<S3File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<S3File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [files, selectedFilter, searchQuery]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllS3Files();
      if (response.success) {
        setFiles(response.files);
      } else {
        setError("Failed to fetch files");
      }
    } catch (err) {
      setError("Error loading files. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilesByFolder = async (folder: string) => {
    if (folder === "all") {
      fetchFiles();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const validFolders = ["images", "videos", "letters", "others"] as const;
      const typedFolder = validFolders.includes(folder as any)
        ? (folder as typeof validFolders[number])
        : "others";

      const response = await getS3FilesByFolder(typedFolder);
      if (response.success) {
        setFiles(response.files);
      } else {
        setError("Failed to fetch files");
      }
    } catch (err) {
      setError("Error loading files. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...files];

    // Apply file type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((file) => file.type === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((file) =>
        file.fileName.toLowerCase().includes(query)
      );
    }

    setFilteredFiles(filtered);
  };

  const handleFolderChange = (folder: string) => {
    setSelectedFolder(folder);
    fetchFilesByFolder(folder);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getFileIcon = (type: string): string => {
    const icons: Record<string, string> = {
      image: "🖼️",
      video: "🎥",
      pdf: "📄",
      word: "📝",
      excel: "📊",
      powerpoint: "📽️",
      text: "📃",
      audio: "🎵",
      archive: "📦",
      other: "📎",
    };
    return icons[type] || "📎";
  };

  const getFileName = (filePath: string): string => {
    return filePath.split("/").pop() || filePath;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            S3 Bucket Files
          </h1>
          <p className="text-gray-600">
            Browse and manage all files uploaded to the S3 bucket
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Folder Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => handleFolderChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {FOLDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {FILE_TYPE_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="bg-blue-100 px-3 py-1 rounded-full">
              Total Files: {files.length}
            </span>
            <span className="bg-green-100 px-3 py-1 rounded-full">
              Filtered: {filteredFiles.length}
            </span>
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Files Grid */}
        {!loading && filteredFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* File Preview */}
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {file.type === "image" ? (
                    <img
                      src={file.url}
                      alt={getFileName(file.fileName)}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type === "video" ? (
                    <video className="w-full h-full object-cover" controls>
                      <source src={file.url} type={file.contentType} />
                    </video>
                  ) : (
                    <div className="text-6xl">{getFileIcon(file.type)}</div>
                  )}
                </div>

                {/* File Info */}
                <div className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-gray-900 truncate"
                        title={getFileName(file.fileName)}
                      >
                        {getFileName(file.fileName)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {file.fileName}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Type: {file.type.toUpperCase()}</p>
                    <p>Size: {formatFileSize(file.size)}</p>
                    <p>Modified: {formatDate(file.lastModified)}</p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-500 text-white text-center text-sm px-3 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      View
                    </a>
                    <a
                      href={file.url}
                      download={getFileName(file.fileName)}
                      className="flex-1 bg-gray-200 text-gray-700 text-center text-sm px-3 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No files found
            </h3>
            <p className="text-gray-600">
              {files.length === 0
                ? "No files have been uploaded to the S3 bucket yet."
                : "No files match your current filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
