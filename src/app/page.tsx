import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUsSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutUs />
      <Footer />
    </div>
  );
}
