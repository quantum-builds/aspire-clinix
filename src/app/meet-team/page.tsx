export default function MeetTeamPage() {
  return (
    <div className="w-full bg-feeGuide flex justify-center items-center min-h-screen">
      <div className="w-full h-full p-5 md:size-4/5 flex justify-center items-center">
        <div className="flex flex-col lg:flex-row lg:px-7 lg:text-left gap-8 md:gap-x-16 sm:mt-[20px]">
          {/* Video Section */}
          <div className="w-full h-full mt-5 lg:w-[832px] md:max-h-[539px]">
            <video
              className="w-full h-auto object-cover"
              controls
              autoPlay
              muted
              loop
              src="https://www.youtube.com/watch?v=SQo0e0qV_2A"
            ></video>
          </div>

          {/* Content Section */}
          <div className="w-full h-full  md:w-1/3">
            <div className="flex flex-col gap-3">
              <h1 className="text-[24px] font-normal font-opus">
                Dr. Raheel Malik
              </h1>
              <span className="text-[16px] font-normal">
                BSc (Hons), BDS (Lond.), MJDF RCS
              </span>
            </div>

            <div className="mt-5">
              <p className="font-gillSans font-light text-base">
                Ullamcorper dui varius volutpat primis lacinia elit morbi velit.
                Lorem ipsum odor amet, consectetuer adipiscing elit.
                <br /> <br /> Lorem ipsum odor amet, consectetuer adipiscing
                elit. Convallis nec justo ipsum pretium risus. Mauris interdum
                phasellus tincidunt hendrerit mi integer. Nullam efficitur
                bibendum scelerisque ligula taciti magna velit aliquet. Ultrices
                mollis felis arcu sit interdum. Diam maximus sit mollis hac quis
                senectus potenti montes fringilla. Fames velit aptent tempor;
                placerat faucibus habitasse <br /> <br />
                Egestas pulvinar mi justo nisl commodo litora litora. Erat
                scelerisque facilisis ligula augue facilisi class ornare.
                Consequat sodales porta per aenean platea fusce. Ligula
                vestibulum curae adipiscing laoreet magnis sodales. Hac rhoncus
                in non enim suscipit dis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
