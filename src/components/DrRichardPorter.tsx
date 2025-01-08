export default function DrRichardPorter() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex justify-center items-center flex-col gap-4">
        <div className="flex justify-start items-start w-full">
          <h1 className="font-opus font-normal text-[24px]">
            Dr. Richard Porter on General Dentistry
          </h1>
        </div>
        <div className="lg:w-[900px] md:w-[700px] w-full xl:w-[1232px] h-full lg:h-[798px]">
          <video
            className="object-cover w-full h-full"
            controls
            autoPlay
            muted
            loop
            src="https://www.youtube.com/watch?v=SQo0e0qV_2A"
          ></video>
        </div>
      </div>
    </div>
  );
}
