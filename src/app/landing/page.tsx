import AboutUsSection from "./components/AboutUsSection";
import HeroSection from "./components/HeroSection";
import ServiceSection from "./components/ServicesSection";

export default function BookTreatment() {
  return (
    <div id="landing" className="flex flex-col">
      <HeroSection />
      <AboutUsSection />
      <ServiceSection />
    </div>
  );
}
