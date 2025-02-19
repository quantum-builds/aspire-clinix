import { LinkIcon, LocationIcon, SheduleIcon, VideoIcon } from "@/assets";
import Image from "next/image";

const APPOINTMENT_BLOCK_DATA = {
  date: "THURSDAY, 07 MAY 2025",
  time: "10.30 - 11.30 (1 hour)",
  address: "27 Mortimer Street, W1N 7RJ,London, UK",
  doctor: "Dr. Raheel Malik, Periodontist",
};

const RESOURSES_DATA = {
  video: "Video: How to clean your teeth effectively",
  links: "Aftercare Treatment",
};

const MESSAGES_DATA = [
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
  {
    doctor: "Dr. Raheel Malik,",
    recieved: "10.30am, 30 Apr",
    message:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  },
];
export default function ContentSection() {
  return (
    <div className="zoom-out flex-1 p-2 md:p-10 lg:px-10 lg:py-14 flex flex-col gap-11">
      <div className="flex flex-col gap-6">
        <p className="text-5xl font-normal font-opus">Hello again, Damien</p>
        <p className="text-xl font-light font-gillSans">
          You have 3 new messages and 1 request that needs your attention
        </p>
      </div>
      <div className="flex flex-col gap-9">
        <div className="flex flex-row ">
          <p className="flex-1 text-3xl font-opus text-start">
            Next Appointments
          </p>
          <p className="flex-1 text-3xl font-opus text-start">Resources</p>
        </div>
        <div className="flex lg:flex-row flex-col gap-7">
          <div className="flex-1 bg-feeGuide flex flex-col  gap-10 px-10 py-14 rounded-xl">
            <p className="text-2xl font-gillSans font-semibold">
              {APPOINTMENT_BLOCK_DATA.date}
            </p>
            <div className="flex gap-4 items-center">
              <Image
                src={SheduleIcon}
                alt="shedule-icon"
                width={40}
                height={40}
              />
              <p className="text-2xl font-gillSans">
                {APPOINTMENT_BLOCK_DATA.time}
              </p>
            </div>
            <div className="flex gap-7 items-center ">
              <Image
                src={LocationIcon}
                alt="location-icon"
                width={30}
                height={30}
              />
              <p className="text-2xl font-gillSans">
                {APPOINTMENT_BLOCK_DATA.address}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
              <p className="text-2xl font-gillSans">
                {APPOINTMENT_BLOCK_DATA.doctor}
              </p>
            </div>
            <div className="w-full h-[2px] bg-black"></div>
            <p className="text-2xl font-opus text-center">Manage Appointment</p>
          </div>
          <div className="flex-1 bg-feeGuide flex flex-col gap-10 px-10 py-14 rounded-xl">
            <div className="flex gap-4 items-center">
              <Image src={VideoIcon} alt="video-icon" width={30} height={30} />
              <p className="text-2xl font-gillSans">{RESOURSES_DATA.video}</p>
            </div>
            <div className="flex gap-7 items-center ">
              <Image src={LinkIcon} alt="link-icon" width={20} height={20} />
              <p className="text-2xl font-gillSans">{RESOURSES_DATA.links}</p>
            </div>
          </div>
        </div>
        <p className=" text-3xl font-opus text-start">New Messages</p>
        <div className="bg-feeGuide flex flex-col gap-10 px-10 py-14 rounded-xl max-h-[60vh] md:max-h-[70vh] lg:max-h-[100vh] xl:max-h-[120vh] overflow-y-auto scrollbar">
          {MESSAGES_DATA.map((data, index) => (
            <div key={index}>
              <div className="flex flex-row items-center gap-6">
                <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                <div className="flex flex-col gap-1">
                  <p className="font-gillSans font-medium text-2xl">
                    {data.doctor}
                  </p>
                  <p className="font-gillSans font-light italic">
                    {data.recieved}
                  </p>
                </div>
              </div>
              <p className="p-4 lg:p-14 w-2/3 text-base lg:text-2xl font-light">
                {data.message}
              </p>
              <div className="w-full h-[2px] bg-black"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
