"use client";

import { useState } from "react";
import { axiosInstance } from "@/config/api-config";
import { FILE_TYPE } from "@/types/common";

export default function MediaUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FILE_TYPE>(FILE_TYPE.IMAGES);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<
    { url: string; fileName: string }[] | null
  >(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return alert("Please select a file first!");

    setUploading(true);

    try {
      // Get the signed URL from the API with fileType param
      const response = await axiosInstance.get("/api/s3", {
        params: {
          fileName: selectedFile.name,
          fileType: fileType, // send selected file type here
        },
      });

      const data = await response.data;

      if (!data.success) throw new Error("Failed to get signed URL");

      // Upload file to S3
      await fetch(data.url, {
        method: "PUT",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });

      fetchMediaFiles();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch(`/api/uploads`);
      const data = await response.json();

      if (data.success) {
        if (data.media) {
          setMediaFiles(data.media);
        } else {
          setMediaFiles(data.url);
        }
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Upload an Image or Video</h1>

      {/* File Input */}
      <input
        type="file"
        accept="
    image/*,
    video/*,
    application/pdf,
    application/msword,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document
  "
        onChange={handleFileChange}
        className="mb-4 p-2 border rounded-lg"
      />

      {/* File Type Dropdown */}
      <select
        value={fileType}
        onChange={(e) => setFileType(e.target.value as FILE_TYPE)}
        className="mb-4 p-2 border rounded-lg"
      >
        <option value={FILE_TYPE.IMAGES}>Images</option>
        <option value={FILE_TYPE.VIDEO}>Video</option>
        <option value={FILE_TYPE.PDF}>PDF</option>
      </select>

      {/* Upload Button */}
      <button
        onClick={uploadFile}
        disabled={!selectedFile || uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Fetch Files Button */}
      <button
        onClick={fetchMediaFiles}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Fetch Uploaded Files
      </button>

      {/* Display Uploaded Media */}
      {mediaFiles && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {mediaFiles.map((file, index) =>
            file.fileName.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
              <>
                <img
                  key={index}
                  src={file.url}
                  alt="Uploaded"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
                <p>File Name :{file.fileName}</p>
              </>
            ) : (
              <>
                <video key={index} controls width="400">
                  <source
                    src={file.url}
                    type={`video/${file.fileName.split(".").pop()}`}
                  />
                  Your browser does not support the video tag.
                </video>
                <p>File Name :{file.fileName}</p>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}
