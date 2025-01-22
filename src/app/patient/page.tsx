import Link from "next/link";

export default function Patient() {
  return (
    <div className="relative w-full h-full">
      {/* Background Video */}
      <video
        className=" w-full h-full object-cover"
        src="/videos/landing-page-video.mp4"
        autoPlay
        loop
        muted
      ></video>

      {/* Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <Link href="/patient/book-treatment" scroll={false}>
          <button
            className="flex justify-center items-center w-[90px] h-[42px] md:w-[170px] md:h-[60px] lg:w-[277px] lg:h-[77px] font-normal md:text-[20px] text-[13px] font-opus rounded-[5px] md:rounded-[20px]"
            style={{ backgroundColor: "#EBEBEB" }}
          >
            BOOK A TREATMENT
          </button>
        </Link>
      </div>
    </div>
  );
}
