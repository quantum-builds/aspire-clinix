
// "use client";
// import { axiosInstance } from "@/config/api-config";
// import { useEffect, useState } from "react";

// export default function VideoUpload() {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [videoUrl, setVideoUrl] = useState<string>("");
//   const [videos, setVideos] = useState<any[]>([]);

//   // useEffect(() => {
//   //   console.log("file is ", file);
//   // }, [file]);
//   const fetchVideos = async () => {
//     try {
//       const response = await axiosInstance.get("api/videos");
//       setVideos(response.data.videos);
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     console.log("file is ", file);
//     if (!file) return alert("Please select a file.");
//     setUploading(true);

//     const reader = new FileReader();

//     reader.onloadend = async () => {
//       console.log("in handle upload ", file);
//       const base64File = reader.result as string;
//       const fileDataJson = {
//         fileName: file.name,
//         fileType: file.type,
//         fileContent: base64File.split(",")[1],
//       };

//       console.log("File data as JSON:", fileDataJson);

//       try {
//         const response: any = await axiosInstance.post(
//           "api/videos",
//           {
//             fileDataJson,
//             patientId: "11",
//             dentistId: "12",
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Response from server:", response.data);
//         if (response.data.url) {
//           setVideoUrl(response.data.url);
//         }
//       } catch (error) {
//         console.error("Error uploading file:", error);
//         alert("There was an error uploading the file.");
//       } finally {
//         setUploading(false);
//       }
//     };

//     // Start reading the file
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="flex flex-col gap-10">
//       <div>
//         <input type="file" accept="video/*" onChange={handleFileChange} />
//         <button onClick={handleUpload} disabled={uploading}>
//           {uploading ? "Uploading..." : "Upload Video"}
//         </button>
//       </div>
//       <div>
//         <h3>All Uploaded Videos:</h3>
//         <button
//           onClick={fetchVideos}
//           className="bg-blue-500 py-3 px-2 rounded-md"
//         >
//           Show me videos
//         </button>
//         {videos.map((video) => (
//           <div key={video.public_id}>
//             <video width="400" controls>
//               <source src={video.secure_url} type="video/mp4" />
//             </video>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
