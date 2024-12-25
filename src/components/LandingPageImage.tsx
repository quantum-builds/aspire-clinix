import { AspireFullImage } from "@/assets";
import Image from "next/image";
export default function LandingPageImage() {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Image
        src={AspireFullImage}
        alt="Dentist Background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
    </div>
  );
}
