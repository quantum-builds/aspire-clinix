interface DoctorPageProps {
  videoSrc: string;
  doctorName: string;
  academicDetails: string;
  doctorDescription: string;
}
export default function DoctorPage({
  videoSrc,
  doctorName,
  academicDetails,
  doctorDescription,
}: DoctorPageProps) {
  const descriptionLines = doctorDescription.split("\n");
  return (
    <div className="w-full bg-feeGuide flex justify-center lg:items-center min-h-screen">
      <div className="zoom-out flex flex-col lg:flex-row gap-14">
        <div>
          <video
            className="w-full h-full xl:w-[832px] p-4 lg:p-0 md:h-[539px]"
            controls
            autoPlay
            muted
            loop
            preload="auto"
            src={"/videos/general-dentistry-01.mp4"}
          ></video>
        </div>
        <div className="flex flex-col p-4 lg:p-0  gap-3">
          <h1 className="text-[24px] font-normal font-opus text-nowrap">
            {doctorName}
          </h1>
          <span className="text-[16px] font-normal text-nowrap">
            {academicDetails}
          </span>
          <div className="font-gillSans font-light text-base w-full lg:w-[409px] lg:h-[385px] xl:h-[347px]">
            {descriptionLines.map((line, index) => (
              <p key={index} className="mb-4">
                {line.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
