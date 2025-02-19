// import Link from "next/link";

// export default function Dentist() {
//   return (
//     <div className="relative w-full h-full">

//       <video
//         className=" w-full h-full object-cover"
//         src="/videos/landing-page-video.mp4"
//         autoPlay
//         loop
//         muted
//       ></video>

//       <div className="absolute inset-0 flex items-center justify-center z-20">
//         <Link href="/dentist/referral" scroll={false}>
//           <button
//             className="flex justify-center items-center w-[90px] h-[42px] md:w-[170px] md:h-[60px] lg:w-[277px] lg:h-[77px] font-normal md:text-[20px] text-[13px] font-opus rounded-[5px] md:rounded-[20px]"
//             style={{ backgroundColor: "#EBEBEB" }}
//           >
//             Open Referral Form
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";
import { axiosInstance } from "@/config/api-config";
import { useState } from "react";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videos, setVideos] = useState<any[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await axiosInstance.get("api/videos");
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    console.log("file is ", file);
    setUploading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64File = reader.result as string;

      // Create a JSON object with the file's data
      const fileDataJson = {
        fileName: file.name,
        fileType: file.type,
        fileContent: base64File.split(",")[1],
      };

      console.log("File data as JSON:", fileDataJson);

      try {
        const response: any = await axiosInstance.post(
          "api/video",
          fileDataJson,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response from server:", response.data);
        if (response.data.url) {
          setVideoUrl(response.data.url);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("There was an error uploading the file.");
      } finally {
        setUploading(false);
      }
    };

    // Start reading the file
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
      <div>
        <h3>All Uploaded Videos:</h3>
        <button
          onClick={fetchVideos}
          className="bg-blue-500 py-3 px-2 rounded-md"
        >
          Show me videos
        </button>
        {videos.map((video) => (
          <div key={video.public_id}>
            <video width="400" controls>
              <source src={video.secure_url} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}
