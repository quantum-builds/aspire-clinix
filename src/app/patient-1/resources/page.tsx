import CustomVideoPlayer from "@/components/CustomVideoPlayer";

const RESOURCES_DATA = [
  {
    videoUrl: "/videos/landing-page-video-1.mp4",
    description: "Video: How to clean your teeth effectively",
  },
  {
    videoUrl: "/videos/landing-page-video-1.mp4",
    description: "Video: How to clean your teeth effectively",
  },
  {
    videoUrl: "/videos/landing-page-video-1.mp4",
    description: "Video: How to clean your teeth effectively",
  },
  {
    videoUrl: "/videos/landing-page-video-1.mp4",
    description: "Video: How to clean your teeth effectively",
  },
  {
    videoUrl: "/videos/landing-page-video-1.mp4",
    description: "Video: How to clean your teeth effectively",
  },
  {
    videoUrl: "/videos/landing-page-video-1.mp4",
    description: "Video: How to clean your teeth effectively",
  },
  {
    videoUrl: "/videos/landing-page-video-1.mp4",
    description: "Video: How to clean your teeth effectively",
  },
];

export default function Resources() {
  return (
    <div className="zoom-out flex-1 p-8 md:p-10 lg:px-[7%] lg:py-[9%] flex flex-col gap-11 bg-feeguidedark">
      <div className="flex flex-col gap-6">
        <p className="text-4xl font-normal font-opus">RESOURCES</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-7">
          {RESOURCES_DATA.map((resource) => (
            <div className="flex flex-col gap-4 ">
              {/* <video
                className="w-full h-full xl:w-[900px] xl:h-[400px] p-8 lg:p-0"
                controls
                preload="auto"
                src={resource.videoUrl}
              ></video> */}
              <CustomVideoPlayer src={resource.videoUrl} />
              <p className="font-gillSans text-lg lg:text-xl xl:text-2xl">
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
