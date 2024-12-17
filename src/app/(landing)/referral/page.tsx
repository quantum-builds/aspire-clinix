import HeroSection from "@/components/HeroSection";
import ReferralForm from "@/components/ReferralForm";

export default function ReferralPage() {
  const heroBackgroundColor = "#DCD4C9";
  const herobuttonColor = "#ECE8E3";
  return (
    <div className="bg-[#ECE8E3]">
      <HeroSection
        title="Dental Treatment Fee Guide"
        descLineHeight={28}
        description="Explore our fee structure and treatment options."
        backgroundColor={heroBackgroundColor}
        buttonColor={herobuttonColor}
        textColor="white"
      />
      <ReferralForm />
    </div>
  );
}
