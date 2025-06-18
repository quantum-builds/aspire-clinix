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
    "We provide advanced general and specialist dental care with a personal touch. Our hand-picked and superbly skilled team offers a wide range of treatments...",
  services: [
    {
      title: "General ",
    description:
     "Your oral health is one of the foundations of your overall well-being and at Aspire we treat it with the care it deserves.",

      path: "/general-dentistry",
      backgroundContent: image1,
    },
    {
      title: "Emergency ",
      description:
     "When urgent dental care is needed, Aspire is here to provide prompt, professional support.we can to relieve your discomfort as quickly as possible. ",
      path: "/services/emergency",
      backgroundContent: image2,
    },
    {
      title: "Cosmetic ",
      description:
     "At our Cosmetic Clinic, we specialise in enhancing your smile to reflect your true confidence and individuality.",
      path: "/services/cosmetic",
      backgroundContent: image3,
    },
    {
      title: "Implants ",
      description:
     "Dental implants are a long-lasting, natural-looking solution for replacing missing teeth—restoring both function and confidence.",
      path: "/services/implants",
      backgroundContent: image1,
    },
    {
      title: "Gums ",
      description:
     "Your gums are the foundation of a strong, beautiful smile. Having healthy and beautiful gums is a key foundation to all dental health.",
      path: "/services/gums",
      backgroundContent: image2,
    },
    {
      title: "Oral Surgery",
      description:
     "Our expert team at Aspire specialises in a wide range of oral surgical procedures, from managing wisdom tooth problems to simple dental extractions.",
      path: "/services/surgery",
      backgroundContent: image3,
    },
    {
      title: "Dentures ",
      description:
     "Our expert team at Aspire specialises in a wide range of oral surgical procedures, from managing wisdom tooth problems to simple dental extractions.",
      path: "/services/dentures",
      backgroundContent: image1,
    },
    {
      title: "Root Canals",
      description:
     "Root canal treatment (Endodontics) is often the best way to preserve a natural tooth that has been damaged by decay or trauma reaching the nerve.",
      path: "/services/root",
      backgroundContent: image2,
    },
    {
      title: "Orthodontic",
      description:
     "Our Orthodontic Clinic offers expert care to help you achieve a beautifully aligned smile",
      path: "/services/orthodontic",
      backgroundContent: image3,
    },
    {
      title: "Kids ",
      description:
     "Our Kids' Clinic is dedicated to providing a welcoming and friendly environment where children can receive top-quality dental care.",
      path: "/services/kid",
      backgroundContent: image1,
    },
  ],
};

const ASTHETIC_SERVICE = {
  title: "Aesthetics",
  description:
        "We provide a wide range of tailored treatments to subtly enhance your natural beauty with precision and care. Our facial aesthetics team, carefully selected for their expertise, takes the time to understand your unique..." ,
  services: [
    {
      title: "Anti Wrinkle Injections",
      description: "Our Anti-Wrinkle Injections are designed to help you achieve a smoother, more youthful appearance with minimal downtime."
,
      path: "/services/anti-wrinkle",
      backgroundContent: image1,
    },


    {
      title: "Fillers",
      description: "Our Dermal Fillers are crafted to enhance your natural features and restore youthful volume.Each treatment is designed to smooth lines, restore balance,"
,
      path: "/services/fillers",
      backgroundContent: image2,
    },

    {
      title: "Skin Boosters",
      description: "Our Skin Boosters are designed to deeply hydrate and rejuvenate your skin from within, restoring a radiant, glowing complexion."
,
      path: "/services/boosters",
      backgroundContent: image3,
    },

   
   
  ],
};

const WELLNESS_SERVICE = {
  title: "Wellness",
  description:
"At Aspire Wellness, we adopt an integrative approach to your health, offering services that nourish both body and mind.Our focus- cultivating long-term vitality, relaxation...",
  services: [
    {
      title: "Cryotherapy",
      description:
        "Cryotherapy is a cutting-edge wellness treatment that harnesses the power of cold to promote recovery, dramatically reduce inflammation, and boost overall well-being. ",
      path: "/services/crypo",
      backgroundContent: Wellness1,
    },
    {
      title: "Infra-red Sauna",
      description:
        "Our Sunlighten Infrared Sauna offers a relaxing and rejuvenating experience that promotes deep detoxification, improved circulation, and enhanced relaxation. ",
      path: "/services/sauna",
      backgroundContent: Wellness2,
    },
    {
      title: "Contrast Therapy",
      description:
        "Contrast Therapy combines the powerful benefits of heat and cold to support recovery, improve circulation, and ease muscle tension. ",
      path: "/services/contrast",
      backgroundContent: Wellness3,
    },
    {
      title: "Hyperbaric Oxygen",
      description:
        "Hyperbaric Oxygen Therapy is a powerful treatment designed to accelerate healing and promote overall wellness. ",
      path: "/services/oxygen",
      backgroundContent: Wellness4,
    },
    {
      title: "Ice Baths",
      description:
        "Ice Baths are a powerful and dynamic recovery tool that helps reduce muscle soreness, promote healing, and boost overall wellness. ",
      path: "/services/ice",
      backgroundContent: Wellness5,
    },
    {
      title: "Massage",
      description:
        "Our Massage Therapy services at Aspire are designed to relax both body and mind, helping to ease tension, improve circulation, and enhance overall wellness.",
      path: "/services/massage",
      backgroundContent: Wellness6,
    },
    
    {
      title: "Compression Therapy",
      description:
        "Experience the rejuvenating benefits of Compression Therapy at Aspire. ",
      path: "/services/compression",
      backgroundContent: Wellness8,
    },
    {
      title: "IV Lounge",
      description:
        "Revitalise your body and mind at Aspire's IV Lounge, where personalised intravenous treatments deliver essential nutrients ",
      path: "/services/lounge",
      backgroundContent: Wellness9,
    },
  ],
};

const HERO_SECTION_DATA = {
  title: "Your journey to holistic wellness, radiant smiles, vibrant energy, and a flourishing life starts here.",
  description: null,
  descTextSize: null,
  contentWidth: 100,
  backgroundColor: "#FFFFFF",
  buttonColor: "#ECE8E3",
  backgroundContent: "/videos/landing-page-video-1.mp4",
}

const ABOUT_US_SECTION_DATA = {
  description:
"Welcome to the Aspire Clinic – enhancing your body and mind through expert care, state-of-the-art facilities, emotional wellbeing programmes, precision aesthetics, world-class dentistry, and a strong emphasis on prevention.<br/>At Aspire, we're committed to supporting your journey towards better health, providing personalised dental and wellness services that prioritise your unique needs. We believe that true well-being stems from a holistic approach, where exceptional care and meaningful connections work together to elevate your health and quality of life.<br/>Our wellness clinic is designed to engage all your senses, offering enriching experiences that focus on preventive health and wellbeing - all delivered with expertise and elegance in one of London's most stunning clinics.",  descriptionTextSize: 28,
  descriptionLeadingHeight: 36,
  buttonClickLink: "/our-philopsophy",
  hasButton: true,
  buttonText: "Our Philosophy",
  backgroundColor: "#1D120C",
  textColor: "#C9BCA9",
  descriptionWidth: 90,
  buttonBackgroundColor: "#ECE8E3",
}



const SUPPLEMENTS_DATA = {
  title: "Our Supplements",
  description:
    "Premium, scientifically-formulated supplements designed to support your wellness journey and optimize your health from within.",
  hasButton: true,
  buttonText: "Contact Us",
  buttonClickLink: "/contact-us",
  backgroundColor: "#1D120C",
  textColor: "#C9BCA9",
  buttonBackgroundColor: "#ECE8E3",
}



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