import { AspireFullImage, image1 } from "@/assets";
import Image from "next/image";
export default function LandingPageImage() {
  return (
    <div style={{ position: "relative", height: "100vh",  }}>
      <Image
        src={image1}
        alt="Dentist Background"
        fill
        quality={100}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
