import { AspireFullImage, image1 } from "@/assets";
import Image from "next/image";
export default function LandingPageImage() {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "#ECE8E3",
      }}
    >
      <video
        className="w-full h-full py-2 object-cover"
        autoPlay
        loop
        muted
        preload="auto"
        src={"/videos/landing-page-video-2.mp4"}
      ></video>
    </div>
  );
}
