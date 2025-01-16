import HeroSection from "@/components/HeroSection";
import ReferralForm from "@/components/ReferralForm";

export default function ReferralPage() {
  const heroBackgroundColor = "#DCD4C9";
  const herobuttonColor = "#ECE8E3";
  return (
    <div className="bg-feeGuide h-auto">
      <HeroSection
        title={null}
        description="Aspire Dental is pleased to accept referrals from fellow dentists. And we offer referring dentists a series of promises to guarantee the best care for their patients."
        backgroundColor={heroBackgroundColor}
        buttonColor={herobuttonColor}
        textColor="#423C36"
        descLineHeight={45.4}
      />
      <div id="form">
        <ReferralForm />
      </div>
    </div>
  );
}
