import Link from "next/link";

// <div className="min-h-screen bg-feeguidedark p-16 w-full flex flex-col gap-12">
  {/* <header className="flex justify-between">
    <h2 className="text-3xl font-opus">Referral Dashboard</h2>
    <div className="flex flex-col lg:flex-row gap-3 items-center">
      <Link href="/dentist">
        <div className="h-28 w-28 rounded-full bg-gray-300" />
      </Link>
      <Link href="/dentist">
        <div className="w-16 md:w-32 font-gillSans text-lg">
          Dr. Raheel Malik <span className="italic">Periodontist</span>
        </div>
      </Link>
    </div>
  </header> */}
export default function Dentist() {
  return (
      <div className="bg-feeGuide p-10 flex flex-col gap-7 w-1/2 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-3 items-center ">
          <div className="flex flex-col gap-4">
            <div className="h-28 w-28 rounded-full bg-gray-300" />
            <p className="text-sm font-opus text-center">Edit Profile Image</p>
          </div>
          <div className="w-16 md:w-32 font-gillSans text-lg">
            Dr. Raheel Malik <span className="italic">Periodontist</span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex gap-16 font-opus items-center">
            <p className="text-xl">Dentist Details:</p>
            <button className="py-2 px-12 bg-gray-300 rounded-lg">Edit</button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-opus">Full Name</p>
            <p className="font-gillSans text-xl">Dr. Raheel Malik</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-opus">GDC Number</p>
            <p className="font-gillSans text-xl">569 9932 405</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-opus">Practice Address</p>
            <p className="font-gillSans text-xl">XXX</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-opus">Loyalty Points Score</p>
            <p className="font-gillSans text-xl">01923</p>
          </div>
        </div>
      </div>
  );
}
// </div>

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
