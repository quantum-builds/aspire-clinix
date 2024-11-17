import AboutUsSection from "./components/AboutUsSection";
import HeroSection from "./components/HeroSection";

export default function BookTreatment() {
  return (
    <div id="landing" className="flex flex-col">
      <HeroSection />
      <AboutUsSection />
    </div>
  );
}
