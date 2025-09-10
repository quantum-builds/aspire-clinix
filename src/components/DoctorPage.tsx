interface DoctorPageProps {
  doctorName: string;
  academicDetails: string;
  doctorDescription: string;
}
export default function DoctorPage({
  doctorName,
  academicDetails,
  doctorDescription,
}: DoctorPageProps) {
  const descriptionLines = doctorDescription.split("\n");
  return (
    <div className="w-full bg-feeGuide flex justify-center lg:items-center min-h-screen">
      <div className=" flex flex-col lg:flex-row gap-14">
        <div>
          <video
            className="w-full h-full xl:w-[900px] p-8 lg:p-0"
            controls
            autoPlay
            loop
            preload="auto"
            src={"/videos/general-dentistry-01.mp4"}
          ></video>
        </div>
        <div className="flex flex-col p-4 lg:p-0 gap-3">
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
