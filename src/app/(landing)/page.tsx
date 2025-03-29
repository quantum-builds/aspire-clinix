import LandingPageImage from "@/components/LandingPageImage";
import AboutUsSection from "@/components/AboutUsSection";
import HeroSection from "@/components/HeroSection";
import ServiceDetailSection from "@/app/(landing)/components/ServiceDetailsSection";
import ServiceSection from "@/app/(landing)/components/ServicesSection";
import SupplementSection from "@/app/(landing)/components/SupplementSection";
import {
  AiCartoon,
  DentistTreatment,
  DoctorTooth,
  image1,
  image2,
  image3,
  TeethCartoon,
  Wellness1,
  Wellness2,
  Wellness3,
  Wellness4,
  Wellness5,
  Wellness6,
  Wellness7,
  Wellness8,
  Wellness9,
} from "@/assets";
import { title } from "process";

const DENTAL_SERVICES = {
  title: "Dentistry",
  description:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit.",
  services: [
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
  ],
};

const ASTHETIC_SERVICE = {
  title: "Aesthetics",
  description:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  services: [
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
  ],
};

const WELLNESS_SERVICE = {
  title: "Wellness",
  description:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  services: [
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness4,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness5,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness6,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness7,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness8,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: Wellness9,
    },
  ],
};

const HERO_SECTION_DATA = {
  title: "HOLISTIC WELLNESS IS A JOURNEY THAT STARTS HERE",
  description: null,
  descTextSize: null,
  contentWidth: 100,
  backgroundColor: "#FFFFFF",
  buttonColor: "#ECE8E3",
  backgroundContent: "/videos/landing-page-video-1.mp4",
};

const ABOUT_US_SECTION_DATA = {
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descriptionTextSize: 40,
  descriptionLeadingHeight: 45.4,
  buttonClickLink: "/our-philopsophy",
  hasButton: true,
  buttonText: "Our Philosophy",
  backgroundColor: "#1D120C",
  textColor: "#C9BCA9",
  descriptionWidth: 60,
  buttonBackgroundColor: "#ECE8E3",
};

const SUPPLEMENTS_DATA = {
  title: "Our Supplements",
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  hasButton: true,
  buttonText: "Contact Us",
  buttonClickLink: "/contact-us",
  backgroundColor: "#1D120C",
  textColor: "#C9BCA9",
  buttonBackgroundColor: "#ECE8E3",
};

export default function Home() {
  return (
    <div id="landing" className="flex flex-col">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        titleFontSize="md:text-[45px] text-[23px] lg:text-[70px]"
        isVideo={true}
        backgroundContent={HERO_SECTION_DATA.backgroundContent}
      />
      <AboutUsSection
        description={ABOUT_US_SECTION_DATA.description}
        hasButton={ABOUT_US_SECTION_DATA.hasButton}
        buttonText={ABOUT_US_SECTION_DATA.buttonText}
        backgroundColor={ABOUT_US_SECTION_DATA.backgroundColor}
        textColor={ABOUT_US_SECTION_DATA.textColor}
        buttonBackgroundColor={ABOUT_US_SECTION_DATA.buttonBackgroundColor}
        buttonClickLink={ABOUT_US_SECTION_DATA.buttonClickLink}
      />
      <LandingPageImage />
      <div className="bg-feeGuide">
        <ServiceSection />
      </div>
      <div id="dentistry">
        <ServiceDetailSection
          title={DENTAL_SERVICES.title}
          description={DENTAL_SERVICES.description}
          services={DENTAL_SERVICES.services}
        />
      </div>
      <div id="aesthetic">
        <ServiceDetailSection
          title={ASTHETIC_SERVICE.title}
          description={ASTHETIC_SERVICE.description}
          services={ASTHETIC_SERVICE.services}
        />
      </div>
      <div id="wellness">
        <ServiceDetailSection
          title={WELLNESS_SERVICE.title}
          description={WELLNESS_SERVICE.description}
          services={WELLNESS_SERVICE.services}
        />
      </div>
      {/* <SupplementSection
        title={SUPPLEMENTS_DATA.title}
        description={SUPPLEMENTS_DATA.description}
        buttonClickLink={SUPPLEMENTS_DATA.buttonClickLink}
        hasButton={SUPPLEMENTS_DATA.hasButton}
        buttonText={SUPPLEMENTS_DATA.buttonText}
        backgroundColor={SUPPLEMENTS_DATA.backgroundColor}
        textColor={SUPPLEMENTS_DATA.textColor}
        buttonBackgroundColor={SUPPLEMENTS_DATA.buttonBackgroundColor}
      /> */}
    </div>
  );
}

// "use client";
// import { sendEmail } from "@/services/EmailService";
// import { useState } from "react";

// export default function EmailSender() {
//   const [emailData, setEmailData] = useState({
//     to: "",
//     subject: "",
//     text: "",
//   });

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setEmailData({ ...emailData, [name]: value });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     // try {
//     //   const response = await axios.post("/api/send-email", emailData);
//     //   alert("Email sent successfully!");
//     //   console.log(response.data);
//     // } catch (error) {
//     //   console.error("Error sending email:", error);
//     //   alert("Failed to send email.");
//     // }
//     const response = await sendEmail(emailData);
//     console.log("response from email sent ", response);
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
//       <h2 className="text-2xl font-bold mb-6">Send an Email</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="to"
//           placeholder="Recipient Email"
//           value={emailData.to}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-lg"
//           required
//         />
//         <input
//           type="text"
//           name="subject"
//           placeholder="Subject"
//           value={emailData.subject}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-lg"
//           required
//         />
//         <textarea
//           name="text"
//           placeholder="Email content"
//           value={emailData.text}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-lg"
//           required
//         ></textarea>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
//         >
//           Send Email
//         </button>
//       </form>
//     </div>
//   );
// }
